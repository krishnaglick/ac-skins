import React from "react";
import { Layout } from "antd";
import { Nav } from "../components/nav/nav";
const { Content, Footer } = Layout;

import "antd/dist/antd.css";
import "./_app.scss";

export default ({ Component, pageProps }: any) => {
    return (
        <Layout className="layout">
            <Nav />
            <Content style={{ padding: "50px" }}>
                <div className="site-layout-content">
                    <Component {...pageProps} />
                </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>
                <a href="https://github.com/krishnaglick/ac-skins">Animal Crossing Design on Github</a>
            </Footer>
        </Layout>
    );
};
