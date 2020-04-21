import React from "react";
import { PageHeader } from "antd";
import { favorites } from "../util/favorites";
import { DesignCards } from "../components/design-card/design-card";
import { searchDesigns } from "./design-search";
import { DesignData } from "./api/save-design";

export const Home = ({ granblueDesigns }: { granblueDesigns: DesignData[] }) => {
    const designs = favorites.getFavorites();
    return (
        <>
            {designs.length ? (
                <PageHeader title="Favorites">
                    <DesignCards designs={designs} showUserData={true} colSizesOverride={{ lg: 12 }} />
                </PageHeader>
            ) : null}
            <PageHeader title="Try Searching For: Granblue">
                <DesignCards
                    designs={granblueDesigns}
                    showUserData={true}
                    colSizesOverride={{ lg: 12 }}
                    showActions={false}
                />
            </PageHeader>
        </>
    );
};

export async function getServerSideProps() {
    const searchValue = "Granblue";
    const granblueDesigns = await searchDesigns(searchValue);
    return { props: { granblueDesigns, searchValue } };
}

export default Home;
