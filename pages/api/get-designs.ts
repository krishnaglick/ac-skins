import { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "../../util/elastic";
import { Indicies } from "../../util/elastic-indicies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { search, type = Indicies.Outfit } = req.query as { search: string; type: Indicies };
    console.log({ search });
    try {
        res.send(await elasticClient.get(type, search));
    } catch (err) {
        res.status(400).send({ err });
    }
};
