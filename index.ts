import { createWorker } from "tesseract.js";

const worker = createWorker({
  logger: m => console.log(m)
});

const getCreatorId = (text: string) => {
  const creatorIdRegex = /MA-([0-Z]{4})-([0-Z]{4})-([0-Z]{4})/;
  const [creatorId] = creatorIdRegex.exec(text) || [];
  return creatorId;
};

const getOutfitId = (text: string) => {
  const outfitIdRegex = /MO-([0-Z]{4})-([0-Z]{4})-([0-Z]{4})/;
  const [outfitId] = outfitIdRegex.exec(text) || [];
  return outfitId;
};

(async () => {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text }
  } = await worker.recognize(
    // "https://tesseract.projectnaptha.com/img/eng_bw.png"
    "./test-images/eternal-jacket.jpg"
  );
  const creatorId = getCreatorId(text);
  const outfitId = getOutfitId(text);
  console.log({ creatorId, outfitId });
  await worker.terminate();
})();
