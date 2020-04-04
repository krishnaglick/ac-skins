import { Client } from "@elastic/elasticsearch";
import { Indicies } from "./elastic-indicies";
import type { OutfitData } from "../components/submit-outfit";

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
    }

    async save(index: Indicies, body: OutfitData) {
        console.debug({ index, body });
        try {
            await this.client.index({
                index,
                body,
            });
            // await this.client.indices.refresh({ index });
            return { success: "Data Saved Successfully" };
        } catch (err) {
            console.trace("Failed Index Body: ", body);
            console.error("Error Adding Data to Index: ", index, "\n", err);
            throw new Error("Data Failed To Save");
        }
    }

    async get(index: Indicies, outfitName?: string, tags?: string[]): Promise<OutfitData[]> {
        console.debug({ index, outfitName, tags });
        try {
            const queryData = await this.client.search({
                index,
                body: {
                    query: {
                        // match: { tags },
                        match_phrase_prefix: { outfitName },
                    },
                },
            });
            return queryData.body?.hits?.hits || [];
        } catch (err) {
            console.trace("Failed Index Search");
            console.trace({ index, outfitName, tags });
            console.error("Error Searching Index: ", err);
            throw new Error("Unalbe to Search");
        }
    }
}

export const elasticClient = new Elastic();
