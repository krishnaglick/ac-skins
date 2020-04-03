import { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "../../util/elastic";
import { Indicies } from "../../util/elastic-indicies";
import type { OutfitData } from "../../components/submit-outfit";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { index, body } = req.body as { index: Indicies; body: OutfitData };
    try {
        res.send(await elasticClient.save(index, body));
    } catch (err) {
        res.status(400).send(err);
    }
};
