import { NextApiRequest, NextApiResponse } from "next";
import { twitterApi } from "../../util/get-tweet";
import { imageProcessor } from "../../util/image-processor";
import { ProcessedImageResponse } from "./save-outfit";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { url } = req.body as { url?: string };
    if (url) {
        try {
            const processedImage = await processImage(url);
            res.send(processedImage);
        } catch (err) {
            res.status(500).send({ err: err.toString() });
        }
    } else {
        res.status(400).send({ err: "Please provide a valid url to process" });
    }
};

async function processImage(url: string): Promise<ProcessedImageResponse> {
    try {
        if ([".png", ".jpg"].some(extension => url.includes(extension))) {
            return {
                processedOutfits: [await imageProcessor.processImage(url)],
            };
        } else if (url.includes("twitter")) {
            const tweetId = url.split("/").splice(-1)[0];
            const twitterOutfit = await twitterApi.getTweetData(tweetId);
            twitterOutfit.processedOutfits = await Promise.all(
                twitterOutfit.images.map(image => imageProcessor.processImage(image)),
            );
            return twitterOutfit;
        } else if (url.includes("imgur")) {
            throw new Error("Can't parse imgur images yet");
            // Probably need the imgur API
            const imgurId = url.split("/").splice[-1][0];
            return {
                processedOutfits: [
                    // Try imgur as a jpg, then a png
                    await imageProcessor
                        .processImage(`https://i.imgur.com/${imgurId}.png`)
                        .catch(() => imageProcessor.processImage(`https://i.imgur.com/${imgurId}.jpg`)),
                ],
            };
        }
        throw new Error("No scheme to process url");
    } catch (err) {
        console.error("Error processing image: ", err);
        throw new Error("There was a error processing the image, please try again later");
    }
}
