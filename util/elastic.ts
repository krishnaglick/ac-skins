import { Client } from "@elastic/elasticsearch";
import { Indicies } from "./elastic-indicies";
import type { OutfitData } from "../pages/api/save-outfit";
// import defaultData from "../test-data.json";

export type ElasticRecord<T> = {
    _id: string;
    _index: string;
    _score: number;
    _source: T;
    _type: string;
};

class Elastic {
    client: Client;
    constructor() {
        this.client = new Client({
            node: process.env.ELASTIC || "http://localhost:9200",
            auth: {
                username: "elastic",
                password: "elastic",
            },
        });

        Object.values(Indicies).forEach(index => {
            this.client.create(() => ({
                index,
            }));
        });
        // defaultData.forEach(data => {
        //     this.save(Indicies.outfit, data);
        // });
    }

    async save(index: Indicies, body: OutfitData) {
        console.debug({ index, body });
        try {
            // const dupes = await this.getDuplicate(index, body);
            // if (!dupes.length) {
            await this.client.index({
                index,
                body,
            });
            return { success: "Data Saved Successfully" };
            // }
            // await this.client.indices.refresh({ index });
            // return { duplicate: dupes.sort((a, b) => b._score - a._score)[0] };
        } catch (err) {
            console.trace("Failed Index Body: ", body);
            console.error("Error Adding Data to Index: ", index, "\n", err);
            throw new Error("Data Failed To Save");
        }
    }

    // private async getDuplicate(index: Indicies, body: OutfitData): Promise<ElasticOutfitData[]> {
    //     const query = [body.outfitName, body.outfitSource];
    //     if (body.tags?.length) {
    //         query.push(...body.tags);
    //     }
    //     if (body.outfitData?.processedOutfits?.[0].outfitId) {
    //         query.push(body.outfitData.processedOutfits[0].outfitId);
    //     }
    //     const queryData = await this.client.search({
    //         index,
    //         body: {
    //             query: {
    //                 multi_match: {
    //                     query: query.join(" "),
    //                 },
    //             },
    //         },
    //     });
    //     return queryData.body?.hits?.hits || [];
    // }

    async get(index: Indicies, search?: string): Promise<ElasticRecord<OutfitData>[]> {
        console.debug({ index, search });
        try {
            const queryData = await this.client.search({
                index,
                body: {
                    query: {
                        multi_match: {
                            query: search,
                        },
                    },
                },
            });
            return queryData.body?.hits?.hits || [];
        } catch (err) {
            console.trace("Failed Index Search");
            console.trace({ index, search });
            console.error("Error Searching Index: ", err);
            throw new Error("Unalbe to Search");
        }
    }
}

export const elasticClient = new Elastic();
