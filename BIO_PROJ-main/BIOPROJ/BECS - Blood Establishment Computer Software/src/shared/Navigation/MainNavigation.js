import React, {useState} from "react";
import {Link} from 'react-router-dom';

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SidaDrawer";
import Backdrop from "../UIElements/Backdrop";

import './MainNavigation.css'

const MainNavigation = props => {
    console.log(props.isAuthenticated);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    const openDrawerHandler = () => {
        setDrawerIsOpen(true);
    }

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false);
    }

    console.log("MAIN NAVIGATION");

    return (
        <React.Fragment>
            {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
            <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <NavLinks role={props.role} isAuthenticated = {props.isAuthenticated} />
                </nav>
            </SideDrawer>
            <MainHeader>
            <button className="main-navigation__menu-btn" onClick={openDrawerHandler}>
                <span />
                <span />
                <span />
            </button>
            <h1 className="main-navigation__title">
                <Link to='/'>Donations</Link>
            </h1>
            <nav className="main-navigation__header-nav">
                <NavLinks role={props.role} isAuthenticated = {props.isAuthenticated} logOut = {props.logOut}/>
            </nav>
        </MainHeader>
    </React.Fragment>);
};

export default MainNavigation