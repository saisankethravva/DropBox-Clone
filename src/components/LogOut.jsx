import React, { useState } from 'react';
import { Button } from "react-bootstrap";
import { Link } from 'react-router-dom';

function LogOut(props) {
    const [isLogOut, setisLogOut] = useState(
       false
    );
    function clearUser() {
        sessionStorage.clear();
        setisLogOut(true)
    }
    return (
        <div>
            
            <Link to="/" onClick={clearUser}><Button variant="danger" style={{ "marginLeft": "20px" }}>
                LogOut
            </Button></Link>
        </div>

    );
}

export default LogOut
