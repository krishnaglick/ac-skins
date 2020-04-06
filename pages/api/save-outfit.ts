import { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "../../util/elastic";
import { Indicies } from "../../util/elastic-indicies";

interface ProcessedOutfitData {
    creatorId: string;
    outfitId: string;
    outfitImage: string;
    twitterData?: TwitterOutfitData;
}

interface BaseOutfitData extends ProcessedOutfitData {
    outfitName: string;
    outfitSource: string;
    tags: string[];
}

interface TwitterOutfitData {
    hashtags: string[];
    images: string[];
    creator: {
        screen_name: string;
        avatar: string;
    };
    twitterDescription: string;
}

export type OutfitData = BaseOutfitData;
export type TwitterData = TwitterOutfitData;
export type ProcessedOutfit = ProcessedOutfitData;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { index, body } = req.body as { index: Indicies; body: OutfitData };
    console.debug("Body Data: ", body);
    try {
        const createdOutfit = await elasticClient.save(index, body);
        if (createdOutfit.success) {
            res.status(201);
        } else {
            res.status(200);
        }
        res.send(createdOutfit);
    } catch (err) {
        res.status(400).send({ err });
    }
};
