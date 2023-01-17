
global.fetch = require('node-fetch');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const host=window.location.host
export const dataService = {
    getUserData: personData,
    getAdminData: admin_data,
    uploadFile: uploadingFile,
    deleteFile: removeFile,
    getUser: getPerson,

}

export const apiConfig = {
    backendURL: "http://localhost:3001"
}
function admin_data() {

    const requestOption = {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }
    return fetch(`${apiConfig.backendURL}/getAdminData`, requestOption).then(res => {
        console.log(res); 
        return res.json();
    })
}
function personData(userName) {
    const requestOption = {
        method: 'GET',
        headers: { "Content-Type": "application/json" }
    }
    return fetch(`${apiConfig.backendURL}/getUserData/${userName}`, requestOption).then(res => {
        return res.json();
    })
}
function getPerson() {
    var cognitoPool = {
        UserPoolId: 'us-west-1_KhAIP4O2b', 
        ClientId: 'l5qirgu7eubs9btbr0s4o7e7t', 
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(cognitoPool);
    var currentUser = userPool.getCurrentUser();
    
    if (currentUser != null) {
        currentUser.getSession(function(err, session) {
            if (err) {
                alert(err.message || JSON.stringify(err));
                return;
            }
    
            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            currentUser.getUserAttributes(function(err, attributes) {
                if (err) {
                    // Handle error
                    console.log(err);
                } else {
                    // Do something with attributes
                    console.log(attributes);
                }
            });
        });
    }
}


function uploadingFile(inputFile, userData, description) {
    const dataForm = new FormData();
    dataForm.append('inputFile', inputFile);
    dataForm.append('userName', userData);
    dataForm.append('description', description);
    console.log(`UserNAme: ${userData}, desc: ${description}`);
    const optionReq = {
        method: 'POST',
        body: dataForm,
    }
    console.log(optionReq);
    return fetch(`${apiConfig.backendURL}/upload_file`, optionReq).then(res => {
      console.log(res);
        return res;
    })
}
function removeFile(fileName,id) {
    const requestOption = {
        method: 'DELETE',
        body: JSON.stringify({
            "deleteFile": fileName,
            "userId": id
        }),
        headers: { "Content-Type": "application/json" }
    }
    return fetch(`${apiConfig.backendURL}/remove_data`, requestOption)
}




