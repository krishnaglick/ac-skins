import { Client } from "@elastic/elasticsearch";
import { Indicies } from "./elastic-indicies";
import type { DesignData } from "../pages/api/save-design";
import primingData from "../prime-data.json";

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
            node: process.env.ELASTIC ? `http://${process.env.ELASTIC}:9200` : "http://localhost:9200",
            auth: {
                username: "elastic",
                password: "elastic",
            },
        });
    }

    async save(index: Indicies, body: DesignData) {
        console.debug({ index, body });
        try {
            if (!(await this.haveDesign(index, body.designId))) {
                await this.client.index({
                    index,
                    body,
                });
                return { success: true, message: "Data Saved Successfully" };
            }
            return { success: false, message: "Design already exists" };
        } catch (err) {
            console.trace("Failed Index Body: ", body);
            console.error("Error Adding Data to Index: ", index, "\n", err);
            throw new Error("Data Failed To Save");
        }
    }

    async primeData() {
        this.createIndicies();
        for (const data of primingData) {
            try {
                const isDupe = await this.haveDesign(Indicies.Outfit, data.designId);
                if (isDupe) {
                    console.log("Dupe Found");
                } else {
                    console.log("No Dupe Found");
                    this.save(Indicies.Outfit, data as DesignData);
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    private createIndicies() {
        for (const index of Object.values(Indicies)) {
            this.client.create(() => ({
                index,
            }));
        }
    }

    private haveDesign = async (index: Indicies, designId: string) => {
        try {
            const hits: ElasticRecord<DesignData>[] = (
                await this.client.search({
                    index,
                    body: {
                        query: {
                            match: {
                                designId,
                            },
                        },
                    },
                })
            ).body?.hits?.hits;
            return hits.some(hit => hit._source.designId === designId);
        } catch (err) {
            console.error("Error checking for design: ", err);
            return false;
        }
    };

    async get(index: Indicies, search?: string): Promise<ElasticRecord<DesignData>[]> {
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
