import React from 'react'
import { Button, Navbar, Card } from "react-bootstrap";
import { useRouteMatch } from 'react-router-dom';

// rfc
function LogInPage() {
    let { path, url, location } = useRouteMatch();
    const host=window.location.host
    return (
        
        <div style={{ 
            backgroundImage: `url("https://img.freepik.com/free-vector/cloud-network-system-background-vector-social-media-banner_53876-111844.jpg")` 
          }}>
            <div>
            <Navbar bg="primary" variant="dark" style={{ 
            backgroundImage: `url("https://avatars.githubusercontent.com/u/30351660?s=280&v=4")` 
          }}>
                <Navbar.Brand class="justify-content-end">Sanketh-cloud</Navbar.Brand>
            </Navbar>
            <Card style={{ width: '30rem', margin: "200px", justifyContent: "justify-content-center"}}>
                <Card.Header style={{
        backgroundColor: '#A5D6A7'}}>Introducing Sanketh-Cloud App...!</Card.Header>
                <Card.Body style={{
        backgroundColor: '#26A69A'}}>
                    <Card.Text>Click the Button Below</Card.Text>
                    <Button  variant="primary" href="https://sanketh-dropbox.auth.us-west-1.amazoncognito.com/login?client_id=l5qirgu7eubs9btbr0s4o7e7t&response_type=token&scope=email+openid+phone+profile&redirect_uri=http://localhost:80/">
                        LogIn / SignUp  { <a href="https://sanketh-dropbox.auth.us-west-1.amazoncognito.com/login?client_id=l5qirgu7eubs9btbr0s4o7e7t&response_type=code&scope=email+openid+phone+profile&redirect_uri=http://localhost:80/"></a> }
                    </Button>
                </Card.Body>
            </Card>
            </div>

        </div>

    )
}

export default LogInPage
