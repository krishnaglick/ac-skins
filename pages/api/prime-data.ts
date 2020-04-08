import { elasticClient } from "../../util/elastic";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
    try {
        await elasticClient.primeData();
        res.send({ success: true, message: "Data is primed" });
    } catch (err) {
        res.status(500).send({ success: false, message: err.message || err.toString() });
    }
}
