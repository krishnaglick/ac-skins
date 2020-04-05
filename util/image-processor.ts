import { createWorker } from "tesseract.js";
import type { ProcessedOutfit } from "../pages/api/save-outfit";

class ImageProcessor {
    worker = createWorker({
        logger: console.log,
    });
    private getCreatorId = (text: string) => {
        const creatorIdRegex = /MA-([0-Z]{4})-([0-Z]{4})-([0-Z]{4})/;
        const [creatorId] = creatorIdRegex.exec(text) || [];
        return creatorId;
    };

    private getOutfitId = (text: string) => {
        const outfitIdRegex = /MO-([0-Z]{4})-([0-Z]{4})-([0-Z]{4})/;
        const [outfitId] = outfitIdRegex.exec(text) || [];
        return outfitId;
    };

    processImage = async (outfitImage = "./test-images/eternal-jacket.jpg"): Promise<ProcessedOutfit> => {
        await this.worker.load();
        await this.worker.loadLanguage("eng");
        await this.worker.initialize("eng");
        const {
            data: { text },
        } = await this.worker.recognize(outfitImage);
        const creatorId = this.getCreatorId(text);
        const outfitId = this.getOutfitId(text);
        await this.worker.terminate();
        if (!creatorId || !outfitId) {
            throw new Error("Error Parsing Image");
        }
        console.debug("Image Text: ", text);
        return { creatorId, outfitId, outfitImage };
    };
}

export const imageProcessor = new ImageProcessor();
