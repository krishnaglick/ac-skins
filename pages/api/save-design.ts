import { NextApiRequest, NextApiResponse } from "next";
import { elasticClient } from "../../util/elastic";
import { Indicies } from "../../util/elastic-indicies";

interface ProcessedDesignData {
    creatorId: string;
    designId: string;
    designImage: string;
    twitterData?: TwitterDesignData;
}

interface BaseDesignData extends ProcessedDesignData {
    designName: string;
    designSource: string;
    designType: Indicies;
    tags: string[];
}

interface TwitterDesignData {
    hashtags: string[];
    images: string[];
    creator: {
        screen_name: string;
        avatar: string;
    };
    twitterDescription: string;
}

export type DesignData = BaseDesignData;
export type TwitterData = TwitterDesignData;
export type ProcessedDesign = ProcessedDesignData;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { index, body } = req.body as { index: Indicies; body: DesignData };
    console.debug("Body Data: ", body);
    try {
        const createdDesign = await elasticClient.save(index, body);
        if (createdDesign.success) {
            res.status(201);
        } else {
            res.status(200).send(createdDesign);
        }
        res.send(createdDesign);
    } catch (err) {
        res.status(400).send({ err });
    }
};
