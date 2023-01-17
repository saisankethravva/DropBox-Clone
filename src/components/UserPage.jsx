import React, { PureComponent } from 'react'
import { Button, Navbar, Table } from "react-bootstrap";
import { dataService } from '../services/dataService';
import FileUpload from './FileUpload';
import LogInPage from './LogInPage';
import LogOut from './LogOut';
import logo from '../spartanlogi.png'
var jtoken = require('jsonwebtoken');


class UserPage extends PureComponent {
    constructor(props) {
        super(props)


        this.state = {
            userDataDynamo: [],
            userData: undefined,
            desc: "",
            isAdmin: false
        }
        this.setDescription = this.setDescription.bind(this)
        this.updateTable = this.Table1_update.bind(this)
    }

    setDescription(d) {
        this.setState({
            desc: d
        })
    }

    Table2_update(user) {
        dataService.getUserData(user)
            .then(json => {
                console.log(json);
                if (Array.isArray(json)) {
                    this.setState({
                        userDataDynamo: json
                    });
                }
            })
            .catch(reason => {
                console.log("Unable to get the data from database: ", reason);
            });
    }
    Table1_update() {
        console.log("Updating Table 1");
        dataService.getAdminData()
            .then(json => {
                console.log(json);
                if (Array.isArray(json)) {
                    this.setState({
                        userDataDynamo: json
                    });
                }
            })
            .catch(reason => {
                console.log("Unable to get the data from database: ", reason);
            });
    }
    componentDidMount() {
        console.log("sessionStorage");
        var token = sessionStorage.getItem("token");
        console.log(token);
        var decoded = jtoken.decode(token, { complete: true });
        const objUser = decoded.payload;
        this.setState({
            userData: objUser
        })
        const ifAdmin = objUser && objUser["cognito:groups"] && objUser["cognito:groups"].filter(g => g == "admin").length > 0;

        this.setState({ isAdmin: ifAdmin });
        setTimeout(()=> {
            if (this.state.isAdmin){
                this.Table1_update()
            } else {
                this.Table2_update(this.state.userData.email);
            }
        }, 500);
        
      
        dataService.getUser()
    }
    

    downloadOnClick(file) {
        window.open("https://d3ap8en199dpxn.cloudfront.net/" + file);
    }

    deleteOnClick(fileName, id) {
        dataService.deleteFile(fileName, id)
            .then(json => {
                setTimeout(()=> {
                if (this.state.isAdmin){
                    this.Table1_update()
                } else {
                    this.Table2_update(this.state.userData.email);
                }
            }, 300);
                
            })
            .catch(reason => {
                console.log("Failed to delete, reason is : ", reason);
            });
    }

    // fetchListAgain




    render() {

        const { isAdmin } = this.state;

        return (

            <div style={{ 
                backgroundImage: `url("https://img.freepik.com/free-vector/cloud-network-system-background-vector-social-media-banner_53876-111844.jpg")` 
              }}>
               <Navbar className="justify-content-center" style={{
        backgroundColor: '#F3E5F5'}}  ><img src={logo} width = '80' height = '50' /><h1>Sanketh-Cloud</h1><img src={logo} width = '80' height = '50' /></Navbar> 
                <Navbar bg="info" color='green'>
                    <Navbar.Brand>Account Details</Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                            Signed in as: {this.state.userData &&
                                <a href="#login">{this.state.userData.email}</a>}
                            &nbsp;&nbsp;
                            User Type: {
                                isAdmin && <a> "Administrator Access" </a>
                            }
                            {
                                !isAdmin && <a> "User"</a>
                            }
                        </Navbar.Text>
                    </Navbar.Collapse>
                    {this.state.userData && <LogOut></LogOut>}
                    {!this.state.userData && <LogInPage></LogInPage>}
                </Navbar>
                {
                    this.state.userData &&
                    <FileUpload
                        user={this.state.userData.email}
                        desc={this.state.desc}
                        refreshList={e => this.Table1_update()}
                        refreshList2={e => this.Table2_update(e)}
                        isAdmin={isAdmin}
                    >
                    </FileUpload>
                }


                <div style={{ "margin": "50px"}}>
                    <Table striped bordered hover responsive style={{
        backgroundColor: '#D7CCC8'}}>
                        <thead>
                            <tr style={{
        backgroundColor: '#A1887F'}} key={0}>
                                {
                                    isAdmin &&
                                    <th>User Name</th>
                                }

                                <th style={{
        backgroundColor: '#A1887F'}}>File Name</th>
                                <th>Description</th>
                                <th>File Upload Time</th>
                                <th>File Modified Time</th>
                                <th>Download</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.userDataDynamo.map(item => {
                                    return (
                                        <tr key={item.userId}>
                                            {
                                                isAdmin &&
                                                <td>{item.userName}</td>
                                            }

                                            <td>{item.fileName}</td>
                                            <td>{item.description}</td>
                                            <td>{new Date(item.fileCreatedTime).toLocaleString()}</td>
                                            <td>{new Date(item.fileUpdatedTime).toLocaleString()}</td>
                                            <td><Button variant="outline-success" onClick={event => this.downloadOnClick(item.fileName)}>
                                                <a target="_blank" download={item.fileName}>DownLoad</a>
                                            </Button></td>
                                            <td><Button variant="outline-danger" onClick={event => this.deleteOnClick(item.fileName, item.userId)}>
                                                Delete
                                            </Button></td>
                                        </tr>

                                    );
                                })
                            }

                        </tbody>
                    </Table>
                </div>

            </div>

        )
    }
}

export default UserPage