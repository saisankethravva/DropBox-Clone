import React, { PureComponent } from 'react'
//import { useDropzone } from 'react-dropzone'
import { dataService } from '../services/dataService';
import { Card, Button } from 'react-bootstrap';
var jwToken = require('jsonwebtoken');
class FileUpload extends PureComponent {
    constructor(props) {
        super(props)

        this.state = {
            files: [],
            descr: "",
            result: ""
        }
        this.uploadFile = this.uploadFile.bind(this);
    }

    uploadFile() {
        const dataUser = this.props.user
        const data = this.state.files;
        if (data.length > 0) {
            dataService.uploadFile(data[0], dataUser, this.state.descr)
                .then(json => {
                    console.log(json);
                    this.setState({
                        result: "File Uploaded successfully"
                    }); 
                    setTimeout(()=> {
                        if (this.props.isAdmin){
                            this.props.refreshList();
                        } else {
                            this.props.refreshList2(dataUser);
                        } 
                    }, 500);

                })
                .catch(reason => {
                    console.log(reason);
                    this.props.refreshList();
                });
        }
    }

    render() {
        return (
            <div>
                <Card className="text-center" style={{ margin: '2rem 4rem 2rem 4rem'}} >
                    <Card.Header style={{
        backgroundColor: '#F3E5F5'}}> Please upload the file here: {this.state.result} </Card.Header>
                    <Card.Body style={{
        backgroundColor: '#CE93D8'}}>
                        <input type="file" style={{"marginLeft": "20px"}} onChange={e => this.setState({
                            files: e.target.files
                        })}> 
                        </input>
                       <a  style={{"marginLeft": "40px"}}> 
                       <input
                            value={this.state.desc}
                            onChange={e => this.setState({
                                descr: e.target.value
                            })}
                            placeholder="Description"
                            type="text"
                            name="Description"
                        />
                        &nbsp; &nbsp;
                        <Button onClick={this.uploadFile} style={{"padding": "5px"}}>Upload</Button>
                       </a>
                        
                    </Card.Body>
                </Card>

            </div>
        )
    }
}

export default FileUpload