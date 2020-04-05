import { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "../../util/elastic";
import { Indicies } from "../../util/elastic-indicies";

export type ProcessedOutfit = {
    creatorId: string;
    outfitId: string;
    outfitImage: string;
};

interface TwitterOutfitData {
    hashtags: string[];
    images: string[];
    creator: {
        screen_name: string;
        avatar: string;
    };
    twitterDescription: string;
    processedOutfits?: ProcessedOutfit[];
}
interface BaseOutfitData {
    outfitName: string;
    outfitSource: string;
    tags: string[];
    outfitData?: ProcessedImageResponse;
}

export type OutfitData = BaseOutfitData;
export type TwitterOutfit = TwitterOutfitData;
export type ProcessedImageResponse = TwitterOutfit | { processedOutfits?: ProcessedOutfit[] };

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { index, body } = req.body as { index: Indicies; body: OutfitData };
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
