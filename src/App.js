import React, { Fragment } from 'react';
import './App.css';
import UserPage from './components/UserPage';
import LogInPage from './components/LogInPage';

function Application(props) {
  if (props.location && props.location.hash) {
    console.log(props);
    const tokenArr = props.location.hash.split("&");
    if(tokenArr.length > 0) {
      const token = tokenArr[0].replace("#id_token=", "").replace("#access_token=", "")
      sessionStorage.setItem("token", token);
    }
  }
  const Token = sessionStorage.getItem("token")

  const bool =  Token != undefined &&  Token.length>0 ;

  return (
    <Fragment>
         {bool && 
         <UserPage></UserPage>
        } 
        {
          !bool && 
          <LogInPage></LogInPage>
        }


    </Fragment>
   
  );
}

export default Application;
