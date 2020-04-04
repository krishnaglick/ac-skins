import React, { useState } from "react";
import { Input } from "antd";
import axios from "axios";
import type { OutfitData } from "./submit-outfit";

const searchOutfits = async (searchTerm: string) => {
    const data = (await axios.get<OutfitData[]>(`/api/get-outfits?search=${searchTerm}`)).data;
    console.log({ data });
    return [];
};

export const OutfitSearch = () => {
    const [outfits, setOutfits] = useState<OutfitData[]>([]);
    console.log({ outfits });
    return (
        <div>
            <Input.Search
                placeholder="Enter a tag or search term"
                enterButton="Search"
                onSearch={async v => setOutfits(await searchOutfits(v))}
            />
            {outfits.map((outfit, i) => (
                <div key={i}>{JSON.stringify(outfit)}</div>
            ))}
        </div>
    );
};
