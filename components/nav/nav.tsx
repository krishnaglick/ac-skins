import React from "react";
import { Layout, Menu } from "antd";
const { Header } = Layout;

import styles from "./nav.module.scss";
import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <Header>
      <div className={styles.logo} />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["home"]}>
        <Menu.Item key="home">
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item key="outfit-search">
          <Link to="/outfit-search">Outfit Search</Link>
        </Menu.Item>
        <Menu.Item key="submit-outfit">
          <Link to="/submit-outfit">Submit an Outfit</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};
