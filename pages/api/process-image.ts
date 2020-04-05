import { NextApiRequest, NextApiResponse } from "next";
import { twitterApi } from "../../util/get-tweet";
import { imageProcessor } from "../../util/image-processor";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { url } = req.body as { url?: string };
    if (url) {
        if ([".png", ".jpg"].some(extension => url.includes(extension))) {
            // just process an image
        } else if (url.includes("twitter")) {
            const tweetId = url.split("/").splice(-1)[0];
            const twitterOutfit = await twitterApi.getTweetData(tweetId);
            try {
                twitterOutfit.processedOutfits = await Promise.all(
                    twitterOutfit.images.map(image => imageProcessor.processImage(image)),
                );
                return res.send(twitterOutfit);
            } catch (err) {
                console.error("Error processing image: ", err);
                return res.status(500).send({ err: "There was a error processing the image, please try again later" });
            }
        }
    }

    res.status(400).send({ err: "Please provide a valid url to process" });
};
