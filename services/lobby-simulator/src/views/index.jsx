import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Route, Router, Switch } from "react-router-dom";

import Header from "./components/header.jsx";
import routes from "./routes.jsx";

const history = createBrowserHistory();

class Application extends React.Component {
    constructor() {
        super();
        const searchParams = new URLSearchParams(history.location.search);
        this.state = {
            playerId: searchParams.get("obCustId") || ((Math.random() * 10000000) >> 0).toString(),
            appType: parseInt(searchParams.get("appType")) || 1,
            balance: Number(searchParams.get("balance")) || 0
        };
        this.handleChangeInput = this.handleChangeInput.bind(this);
    }

    handleChangeInput(data) {
        this.setState(data);
    }

    render() {
        const { playerId, appType, balance } = this.state;
        const defaultProps = {
            playerId,
            appType,
            balance,
            handleChangeInput: this.handleChangeInput
        };

        const currentPath = history.location.pathname;

        return (
            <Router history={history}>
                {!currentPath.includes("/direct") && !currentPath.includes("/login") && <Header {...defaultProps} />}
                <Switch>
                    {routes.map(({ path, component }, key) => (
                        <Route key={key} path={path} render={(props) => React.createElement(component, { ...props, ...defaultProps })} />
                    ))}
                    <Redirect to={routes[0].path} />
                </Switch>
            </Router>
        );
    }
}

ReactDOM.render(<Application />, document.getElementById("app"));
