import React, { Component } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Login from "./component/login";
import SignUp from "./component/signup";
import Home from "./component/MainPage";
import createHistory from "history/createBrowserHistory";
export const history = createHistory();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { acc: "" };
  }
  // componentDidMount() {
  //   const { history } = this.props;

  //   window.addEventListener("popstate", () => {
  //     history.go(1);
  //   });
  // }
  render() {
    return (
      <Router>
        <div>
          <div className="title">
            <br />
          </div>
          <div>
            <div className="auth-wrapper">
              <div className="auth-inner">
                <Switch history={history}>
                  <Route
                    exact
                    path="/"
                    component={Login}
                    render={() => <Redirect to="/sign-in" />}
                  />
                  <Route path="/sign-in" component={Login} />
                  <Route path="/sign-up" component={SignUp} />
                  <Route path="/home" component={Home} />
                </Switch>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
