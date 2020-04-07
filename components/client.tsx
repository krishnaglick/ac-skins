import React from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory, createMemoryHistory } from "history";
import { Layout } from "antd";
import { Nav } from "./nav/nav";
import { Home } from "./home";
import { DesignSearch } from "./design-search";
import { SubmitDesign } from "./submit-design";

const { Content, Footer } = Layout;

const history = typeof window !== "undefined" ? createBrowserHistory() : createMemoryHistory();

export const App = ({ pathname }: { pathname: string }) => {
    history.push(pathname);
    return (
        <Layout className="layout">
            <Router history={history}>
                <Nav />
                <Content style={{ padding: "50px" }}>
                    <div className="site-layout-content">
                        <Switch>
                            <Route path="/" exact={true} component={Home} />
                            <Route path="/design-search" exact={true} component={DesignSearch} />
                            <Route path="/submit-design" exact={true} component={SubmitDesign} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    <a href="https://github.com/krishnaglick/ac-skins">Animal Crossing Design on Github</a>
                </Footer>
            </Router>
        </Layout>
    );
};
