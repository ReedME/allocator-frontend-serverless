import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./containers/NotFound";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Signup from "./containers/Signup";
import AppliedRoute from "./components/AppliedRoute";
import ResetPassword from "./containers/ResetPassword";
import NewNote from "./containers/NewNote";
import Notes from "./containers/Notes";

function Routes({ appProps }) {
  return (
    <Switch>
      <AppliedRoute path="/" exact component={Home} appProps={appProps} />
      <AppliedRoute path="/login" exact component={Login} appProps={appProps} />
      <AppliedRoute path="/signup" exact component={Signup} appProps={appProps} />
      <AppliedRoute path="/notes/new" exact component={NewNote} appProps={appProps} />
      <AppliedRoute path="/notes/:id" exact component={Notes} appProps={appProps} />
      { /* Finally, catch all unmatched routes */ }
      <Route path="/login/reset" exact component={ResetPassword} props={appProps}/>
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes; 