import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./containers/NotFound";
import Home from "./containers/Home";

function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Home} />
      { /* Finally, catch all unmatched routes */ }
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes; 