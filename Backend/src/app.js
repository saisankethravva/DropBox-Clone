const express = require('express')
const app = express()
const WebServices = require('aws-sdk');
WebServices.config.update({ region: 'us-west-1' });
const dataupload = require('express-fileupload');
let cross = require('cors');
const port = 3001
const dbsystem = require('fs');
const dotenv = require('dotenv');
const config = dotenv.config();

app.use(express.json())
app.use(cross())
app.use(express.urlencoded({ extended: true }))
app.use(dataupload({
  useTempFiles: true,
  tempFileDir: 'tmp'
}));
const Storage = new WebServices.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const Database = new WebServices.DynamoDB({ apiVersion: '2012-08-10' ,
    region: "us-west-1",
    endpoint: "http://dynamodb.us-west-1.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});

function deletefiles(file_path) {
  try {
    dbsystem.unlinkSync(file_path)
    //removing file
  } catch (err) {
    console.error("Unable to delete the file from database" + err);
  }
}
app.post('/upload_file', function (req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('files not found.');
  }
  const fileData = dbsystem.createReadStream(req.files.inputFile.tempFilePath);

  const storage_params = {
    Bucket: "sanketh-dropbox",
    Key: req.files.inputFile.name,
    ContentType: req.files.inputFile.mimetype,
    Body: fileData
  };

  // Uploading files to the bucket
  Storage.upload(storage_params, function (err, data) {
    if (err) {
      console.log("Cannot upload the data file", err);
      return res.status(500).send(`Cannot insert the file. ${err}`)
      // Send 500 Response 
    } else {
      deletefiles(req.files.inputFile.tempFilePath);
      updateDataBase();
      console.log(`File uploaded successfully. ${data.Location}`);
      return res.status(200).send(`File uploaded successfully. ${data.Location}`)
    }
  });

  function updateDataBase() {
    console.log(`userName: ${req.body.userName}`)//.body.userName
    console.log(`FileName: ${req.files.inputFile.name}`)
    var TimeNow = new Date().toString();
    console.log(`currentTime: ${TimeNow}`)
    //var epoch = Math.floor(currentTime/1000)
    //var time = new Date();
    var uName = req.body.userName
    console.log(req.body);
    var desp = req.body.description
    var fName = req.files.inputFile.name;
    var uId = uName.concat("_", fName)
    console.log(`userId: ${uId}`)
    console.log(`description: ${desp}`)

    Database.scan({
      TableName: 'dropbox-files-table',
    }, function (err, data) {
      if (err) {
        console.log("Error", err);

      } else {
        console.log("Database uploaded Successfully", data.Items);
        const Itemsfound = data.Items.filter(item => item.userId.S === uId);
        if (Itemsfound.length > 0) {
          console.log("Data is exisisting already and updating it", Itemsfound);
          const Itemfound = Itemsfound[0];
          console.log("updating data", Itemfound);
          putItem(uId, uName, fName, desp, Itemfound.fileCreatedTime.S);
        } else {
          console.log("creating new file data", uId);
          putItem(uId, uName, fName, desp, TimeNow);
        }

      }
    });

  }

});

function putItem(userId, userName, fileName, description, fileCreationTime) {
  const dbdata_params = {
    TableName: 'dropbox-files-table',
    Item: {
      'userId': { S: userId },
      'userName': { S: userName },
      'fileName': { S: fileName },
      'description': { S: description },
      'fileCreatedTime': { S: fileCreationTime },
      'fileUpdatedTime': { S: new Date().toString() }
    }
  };

  // Call DynamoDB to add the item to the table
  Database.putItem(dbdata_params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}
app.get('/getAdminData', function (req, res) {
  WebServices.config.update({
    region: "us-west-1",
    endpoint: "http://dynamodb.us-west-1.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  
  var clientDoc = new WebServices.DynamoDB.DocumentClient();
  var params = {
    TableName: 'dropbox-files-table',
  };

  // Call DynamoDB to read the item from the table
  clientDoc.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      return res.status(500).send(`Can not get the data. ${err}`)
    } else {
      console.log("Success", data.Items);
      return res.status(200).json(data.Items);
      //return res.status(200).json(data);
    }
  });
});
app.get('/getUserData/:userName', function (req, res) {
  WebServices.config.update({
    region: "us-west-1",
    endpoint: "http://dynamodb.us-west-1.amazonaws.com",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });
  
  var documentClient = new WebServices.DynamoDB.DocumentClient();
  
  var table = "dropbox-files-table";
  const userName = req.params.userName
  console.log("userName:"+userName)
  var parameters = {
      TableName: table,
      FilterExpression: '#userName = :userName',
      ExpressionAttributeNames: {
        '#userName' : 'userName'
      },
      ExpressionAttributeValues: {
        ':userName' : userName
      }

  };
  
  documentClient.scan(parameters, function(err, data) {
      if (err) {
          console.error("Cannot able to read JSON data:", JSON.stringify(err, null, 2));
          return res.status(500).send(`Can not get the data. ${err}`)
      } else {
          console.log("Fetch completed:", JSON.stringify(data, null, 2));
          return res.status(200).json(data.Items);
      }
  });
  
});
app.delete('/remove_data', function (req, res) {
  console.log("REQUEST param ", req.body);
  if (!req.body || !req.body.hasOwnProperty('deleteFile')) {
    return res.status(400).send('deleteFile missing in body');
  }

  const fileDeletePath = req.body.deleteFile
  const userId = req.body.userId
  // Setting up S3 delete parameters
  const params = {
    Bucket: "sanketh-dropbox",
    Key: fileDeletePath
  };
  // Deleting files to the bucket
  Storage.deleteObject(params, function (err, data) {
    if (err) {
      console.log("Error in deleting file", err);
      return res.status(500).send(`Not able to delete the file. ${err}`)
    } else {
      dataBaseDelete();
      return res.status(200).send(`File is successfully deleted.`);
    }

  });

  function dataBaseDelete() {
    const ddbparams = {
      TableName: 'dropbox-files-table',
      Key: {
        "userId": { "S": userId }

      }
    };

    // Call DynamoDB to delete the item from the table
    Database.deleteItem(ddbparams, function (err, data) {
      console.log
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data);
      }
    });
  }
});

app.listen(port, () => console.log(`Dropbox project is running on port ${port}!`))