import { NextApiRequest, NextApiResponse } from "next";
import { twitterApi } from "../../util/get-tweet";
import { imageProcessor } from "../../util/image-processor";

export type ProcessedOutfit = {
    outfits: {
        creatorId: string;
        outfitId: string;
        outfitImage: string;
    }[];
    hashtags: string[];
    creator: {
        screen_name: string;
        avatar: string;
    };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const url: string = req.body.url;
    if (url) {
        if (url.includes("twitter")) {
            const tweetId = url.split("/").splice(-1)[0];
            const imageData = await twitterApi.getTweetData(tweetId);
            const outfit: ProcessedOutfit = {
                outfits: await Promise.all(imageData.images.map(image => imageProcessor.processImage(image))),
                hashtags: imageData.hashtags,
                creator: imageData.creator,
            };
            return res.send(outfit);
        }
    }

    res.status(400).send({ err: "Please provide a url to process" });
};
