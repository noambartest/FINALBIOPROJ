import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} 
from "react-router-dom/cjs/react-router-dom.min";
import BloodsTypes from "./donates/pages/BloodsTypes";
import NewDonate from "./donates/pages/NewDonate";
import MainNavigation from "./shared/Navigation/MainNavigation";
import DonationList from "./donates/pages/DonationList";
import NewDe from "./donates/pages/NewDe";
import Emergency from "./donates/pages/Emergency";
import Login from "./auth/Login"; // Import the Login component
import AdminPage from "./admin/AdminPage";
import Register from "./auth/Register";
import Logout from "./donates/pages/Logout";
import InfoPage from "./donator_pannel/pages/info_page";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [userID, setUserID] = useState("");
  console.log(isAuthenticated);

  const loginHandler = (userid) => {
    setIsAuthenticated(true);
    setUserID(userid);
    console.log(userid);
  };

  const logOutHandler = () => {
    console.log("logOUT");

    setIsAuthenticated(false);
  };

  const roleHandler = (role) => {
    setRole(role);
    console.log(role);
  };

  if(role === "donator")
  {
    return <InfoPage logOut={logOutHandler} id={userID}  />;
  }

  return (
    <Router>
      <MainNavigation role={role} isAuthenticated={isAuthenticated} />
      <main>
        <Switch>
          {!isAuthenticated ? (
            <>
              <Route path="/login" exact>
                <Login onLogin={loginHandler} onRoleChange={roleHandler} />
              </Route>
              <Route path="/register" exact>
                <Register />
              </Route>
            </>
          ) : (
            <>
              <Route path="/" exact>
                <BloodsTypes role={role} />
              </Route>
              <Route path="/:bloodtype/donations" exact>
                <DonationList role={role} />
              </Route>
              <Route path="/donates/newDonation" exact>
                <NewDonate role={role} />
              </Route>
              <Route path="/donates/newDelivery" exact>
                <NewDe role={role} />
              </Route>
              <Route path="/emgc" exact>
                <Emergency role={role} />
              </Route>
              <Route path="/admin/pannel" exact>
                <AdminPage />
              </Route>
              <Route path="/logout" exact>
                <Logout logOut={logOutHandler} /> // Ensure the prop name is
                logOut
              </Route>
            </>
          )}
          <Redirect to="/login" />
        </Switch>
      </main>
    </Router>
  );
};

export default App;
