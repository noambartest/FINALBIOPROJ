import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom/cjs/react-router-dom.min";
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

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  console.log(isAuthenticated);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  const logOutHandler = () => {
    setIsAuthenticated(false);
  };

  const roleHandler = (role) => {
    setRole(role);
  };

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
