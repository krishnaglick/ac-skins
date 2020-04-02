"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tesseract_js_1 = require("tesseract.js");
const worker = tesseract_js_1.createWorker({
    logger: m => console.log(m)
});
const getCreatorId = (text) => {
    const creatorIdRegex = /MA-([0-Z]{4})-([0-Z]{4})-([0-Z]{4})/;
    const [creatorId] = creatorIdRegex.exec(text) || [];
    return creatorId;
};
const getOutfitId = (text) => {
    const outfitIdRegex = /MO-([0-Z]{4})-([0-Z]{4})-([0-Z]{4})/;
    const [outfitId] = outfitIdRegex.exec(text) || [];
    return outfitId;
};
(async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data: { text } } = await worker.recognize(
    // "https://tesseract.projectnaptha.com/img/eng_bw.png"
    "./test-images/eternal-jacket.jpg");
    const creatorId = getCreatorId(text);
    const outfitId = getOutfitId(text);
    console.log({ creatorId, outfitId });
    await worker.terminate();
})();
//# sourceMappingURL=index.js.map