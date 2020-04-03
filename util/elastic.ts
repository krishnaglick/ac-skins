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
    }

    async save(index: Indicies, body: OutfitData) {
        console.debug({ index, body });
        try {
            await this.client.index({
                index,
                body,
            });
            // await this.client.indices.refresh({ index });
            return "Data Saved Successfully";
        } catch (err) {
            console.trace("Failed Index Body: ", body);
            console.error("Error Adding Data to Index: ", index, "\n", err);
            throw new Error("Data Failed To Save");
        }
    }

    async get(index: Indicies, title?: string, tags?: string[]) {
        console.debug({ index, title, tags });
        try {
            return await this.client.search({
                index,
                body: {
                    query: {
                        match: { title, tags },
                    },
                },
            });
        } catch (err) {
            console.trace("Failed Index Search");
            console.trace({ index, title, tags });
            console.error("Error Searching Index: ", err);
            throw new Error("Unalbe to Search");
        }
    }
}

export const elasticClient = new Elastic();
