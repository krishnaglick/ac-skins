import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Layout, Menu } from "antd";
const { Header } = Layout;

import styles from "./nav.module.scss";
export const Nav = () => {
    const router = useRouter();
    const currentRoute = router.pathname.split("/")[1] || "/";
    return (
        <Header>
            <div className={styles.logo} />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[currentRoute]}>
                <Menu.Item key="/">
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="design-search">
                    <Link href="/design-search">
                        <a>Design Search</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="submit-design">
                    <Link href="/submit-design">
                        <a>Submit a Design</a>
                    </Link>
                </Menu.Item>
            </Menu>
        </Header>
    );
};
