import { createWorker } from "tesseract.js";

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

    processImage = async (image = "./test-images/eternal-jacket.jpg") => {
        await this.worker.load();
        await this.worker.loadLanguage("eng");
        await this.worker.initialize("eng");
        const {
            data: { text },
        } = await this.worker.recognize(image);
        const creatorId = this.getCreatorId(text);
        const outfitId = this.getOutfitId(text);
        await this.worker.terminate();
        return { creatorId, outfitId, image };
    };
}

export const imageProcessor = new ImageProcessor();
