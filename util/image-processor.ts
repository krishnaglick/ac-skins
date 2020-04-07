import { createWorker } from "tesseract.js";
import type { ProcessedDesign } from "../pages/api/save-design";

class ImageProcessor {
    worker = createWorker({
        logger: console.log,
    });
    private getCreatorId = (text: string) => {
        const creatorIdRegex = /MA-([0-Z]{4})-([0-Z]{4})-([0-Z]{4})/;
        const [creatorId] = creatorIdRegex.exec(text) || [];
        return creatorId;
    };

    private getDesignId = (text: string) => {
        const designIdRegex = /MO-([0-Z]{4})-([0-Z]{4})-([0-Z]{4})/;
        const [designId] = designIdRegex.exec(text) || [];
        return designId;
    };

    private parseImage = async (image: string) => {
        const {
            data: { text },
        } = await this.worker.recognize(image);
        return text;
    };

    processImage = async (images = ["./test-images/eternal-jacket.jpg"]): Promise<ProcessedDesign> => {
        await this.worker.load();
        await this.worker.loadLanguage("eng");
        await this.worker.initialize("eng");
        let creatorId = "";
        let designId = "";
        let designImage = "";
        for (const image of images) {
            try {
                const text = await this.parseImage(image);
                designImage = image;
                creatorId = this.getCreatorId(text);
                designId = this.getDesignId(text);
                console.debug("Image Text: ", text);
                if (creatorId && designId) {
                    break;
                }
            } catch (err) {
                console.error("Error parsing image: ", image, "\n", err);
            }
        }

        await this.worker.terminate();
        if (!creatorId || !designId) {
            throw new Error("No creatorId or design Id found");
        }
        return { creatorId, designId, designImage };
    };
}

export const imageProcessor = new ImageProcessor();
