import React from "react";
import { App } from "../components/client";
import "antd/dist/antd.css";
import "./_app.scss";

export default class ServerApp extends React.Component<{ pathname: string }> {
    // Next.js's prop for this isn't accurate
    static getInitialProps({ router }: { router: { pathname: string } }) {
        return { pathname: router.pathname };
    }

    render() {
        return <App pathname={this.props.pathname} />;
    }
}
