import React, { useState } from "react";
import { Input } from "antd";
import axios from "axios";
import { DesignCards } from "./design-card/design-card";
import type { DesignData } from "../pages/api/save-design";
import type { ElasticRecord } from "../util/elastic";

const searchDesigns = async (searchTerm: string) => {
    try {
        const { data } = await axios.get<ElasticRecord<DesignData>[]>(`/api/get-designs?search=${searchTerm}`);
        return data.sort((a, b) => a._score - b._score).map(({ _source }) => _source);
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const DesignSearch = () => {
    const [designs, setDesigns] = useState<DesignData[]>([]);
    const [searching, setSearching] = useState(false);
    console.log({ designs });
    return (
        <div>
            <Input.Search
                placeholder="Enter a tag or search term"
                enterButton="Search"
                loading={searching}
                disabled={searching}
                onSearch={async v => {
                    setSearching(true);
                    setDesigns(await searchDesigns(v));
                    setSearching(false);
                }}
            />
            {designs?.length ? <DesignCards designs={designs} showUserData={true} /> : null}
        </div>
    );
};
