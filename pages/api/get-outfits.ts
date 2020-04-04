import { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "../../util/elastic";
import { Indicies } from "../../util/elastic-indicies";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { search } = req.query as { search: string };
    console.log({ search });
    try {
        res.send(await elasticClient.get(Indicies.outfit, search, [search]));
    } catch (err) {
        res.status(400).send({ err });
    }
};
