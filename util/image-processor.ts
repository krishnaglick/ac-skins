import { createWorker } from "tesseract.js";
import type { ProcessedImage } from "../pages/api/save-design";

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

    processImage = async (images = ["./test-images/eternal-jacket.jpg"]): Promise<ProcessedImage[]> => {
        await this.worker.load();
        await this.worker.loadLanguage("eng");
        await this.worker.initialize("eng");
        // return Promise.all(
        //     images.map(async image => {
        //         const text = await this.parseImage(image);
        //         const creatorId = this.getCreatorId(text);
        //         const designId = this.getDesignId(text);
        //         return { creatorId, designId, image };
        //     }),
        // ).finally(() => this.worker.terminate());
        const processedDesigns: ProcessedImage[] = [];
        for (const image of images) {
            try {
                const text = await this.parseImage(image);
                const creatorId = this.getCreatorId(text);
                const designId = this.getDesignId(text);
                processedDesigns.push({
                    image,
                    creatorId,
                    designId,
                });
                console.debug("Image Text: ", text);
            } catch (err) {
                console.error("Error parsing image: ", image, "\n", err);
            }
        }

        await this.worker.terminate();
        return processedDesigns;
    };
}

export const imageProcessor = new ImageProcessor();
