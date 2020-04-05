import React, { useState } from "react";
import { Input } from "antd";
import axios from "axios";
import { OutfitCards } from "./outfit-card/outfit-card";
import type { OutfitData } from "../pages/api/save-outfit";

export type ElasticOutfitData = {
    _id: string;
    _index: string;
    _score: number;
    _source: OutfitData;
    _type: string;
};

const searchOutfits = async (searchTerm: string) => {
    try {
        const { data } = await axios.get<ElasticOutfitData[]>(`/api/get-outfits?search=${searchTerm}`);
        return data.sort((a, b) => a._score - b._score).map(({ _source }) => _source);
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const OutfitSearch = () => {
    const [outfits, setOutfits] = useState<OutfitData[]>([]);
    const [searching, setSearching] = useState(false);
    console.log({ outfits });
    return (
        <div>
            <Input.Search
                placeholder="Enter a tag or search term"
                enterButton="Search"
                loading={searching}
                disabled={searching}
                onSearch={async v => {
                    setSearching(true);
                    setOutfits(await searchOutfits(v));
                    setSearching(false);
                }}
            />
            {outfits?.length ? <OutfitCards outfits={outfits} showUserData={true} /> : null}
        </div>
    );
};
