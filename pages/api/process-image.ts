import { NextApiRequest, NextApiResponse } from "next";
import { twitterApi } from "../../util/get-tweet";
import { imageProcessor } from "../../util/image-processor";
import type { ProcessedOutfit } from "./save-outfit";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { url } = req.body as { url?: string };
    if (url) {
        try {
            const processedImage = await processImage(url);
            res.send(processedImage);
        } catch (err) {
            res.status(500).send(err.toString());
        }
    } else {
        res.status(400).send("Please provide a valid url to process");
    }
};

// TODO: Some generate/yield magic to give a progress bar
async function processImage(url: string): Promise<ProcessedOutfit> {
    try {
        if ([".png", ".jpg"].some(extension => url.includes(extension))) {
            return await imageProcessor.processImage(url);
        } else if (url.includes("twitter")) {
            const tweetId = url.split("/").splice(-1)[0];
            const twitterData = await twitterApi.getTweetData(tweetId);
            let imageData: ProcessedOutfit | undefined;
            for (const image of twitterData.images) {
                try {
                    imageData = await imageProcessor.processImage(image);
                } catch (err) {
                    console.debug("Error Processing Image: ", image);
                }
            }

            if (imageData) {
                imageData.twitterData = twitterData;
                return imageData;
            }
            throw new Error("No image on tweet");
        } else if (url.includes("imgur")) {
            throw new Error("Can't parse imgur images yet");
            // TODO: Probably need the imgur API
            // const imgurId = url.split("/").splice[-1][0];
            // return {
            //     processedOutfits: [
            //         // Try imgur as a jpg, then a png
            //         await imageProcessor
            //             .processImage(`https://i.imgur.com/${imgurId}.png`)
            //             .catch(() => imageProcessor.processImage(`https://i.imgur.com/${imgurId}.jpg`)),
            //     ],
            // };
        }
        throw new Error("No scheme to process url");
    } catch (err) {
        console.error("Error processing image: ", err);
        throw new Error("There was a error processing the image, please try again later");
    }
}
