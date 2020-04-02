import { createWorker } from "tesseract.js";

const worker = createWorker({
  logger: console.log
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

export async function processImage(image = "./test-images/eternal-jacket.jpg") {
  await worker.load();
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  const {
    data: { text }
  } = await worker.recognize(image);
  const creatorId = getCreatorId(text);
  const outfitId = getOutfitId(text);
  console.log({ creatorId, outfitId });
  await worker.terminate();
}
