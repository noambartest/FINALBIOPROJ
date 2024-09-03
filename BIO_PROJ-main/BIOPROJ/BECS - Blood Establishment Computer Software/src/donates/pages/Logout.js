import React from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const Logout = (props) => {
    props.logOut();
    return <Redirect to="/login" />;
}

export default Logout;