import React from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory, createMemoryHistory } from "history";
import { Layout } from "antd";
import { Nav } from "./nav/nav";
import { Home } from "./home";
import { OutfitSearch } from "./outfit-search";
import { SubmitOutfit } from "./submit-outfit";

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
                            <Route path="/outfit-search" exact={true} component={OutfitSearch} />
                            <Route path="/submit-outfit" exact={true} component={SubmitOutfit} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: "center" }}>
                    <a href="https://github.com/krishnaglick/ac-skins">Animal Crossing Outfit on Github</a>
                </Footer>
            </Router>
        </Layout>
    );
};
