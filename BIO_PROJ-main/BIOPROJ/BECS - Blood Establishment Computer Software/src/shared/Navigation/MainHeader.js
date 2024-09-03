import React from "react";

import './MainHeader.css';

const MainHeader = props => {
    console.log("main header");
    return <header className="main-header">
        {props.children}
    </header>
};

export default MainHeader;