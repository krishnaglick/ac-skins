import React from "react";
import { PageHeader } from "antd";
import { favorites } from "../util/favorites";
import { DesignCards } from "../components/design-card/design-card";
export const Home = () => {
    const designs = favorites.getFavorites();
    return (
        <PageHeader title="Favorites">
            {designs.length ? <DesignCards designs={designs} showUserData={true} /> : null}
        </PageHeader>
    );
};
export default Home;
