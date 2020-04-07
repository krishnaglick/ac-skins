import React from "react";
import { Layout, Menu } from "antd";
const { Header } = Layout;

import styles from "./nav.module.scss";
import { Link, withRouter } from "react-router-dom";

export const Nav = withRouter(({ location }) => {
    return (
        <Header>
            <div className={styles.logo} />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[location?.pathname.replace("/", "") || "/"]}>
                <Menu.Item key="home">
                    <Link to="/">Home</Link>
                </Menu.Item>
                <Menu.Item key="design-search">
                    <Link to="/design-search">Design Search</Link>
                </Menu.Item>
                <Menu.Item key="submit-design">
                    <Link to="/submit-design">Submit a Design</Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
});
