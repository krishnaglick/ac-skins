import { NextApiRequest, NextApiResponse } from "next";
import { twitterApi } from "../../util/get-tweet";
import { imageProcessor } from "../../util/image-processor";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const url: string = req.body.url;
    if (url) {
        if (url.includes("twitter")) {
            const tweetId = url.split("/").splice(-1)[0];
            const imageData = await twitterApi.getTweetData(tweetId);
            return res.send({
                outfits: await Promise.all(imageData.images.map(image => imageProcessor.processImage(image))),
                hashtags: imageData.hashtags,
            });
        }
    }

    res.send("asdf");
};
