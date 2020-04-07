import axios from "axios";

import tweetData from "../data.json";
import { api_key, api_secret_key } from "../env.json";
import type { TwitterData } from "../pages/api/save-design";

class Twitter {
    oAuthToken = "";
    getOAuthToken = async () => {
        const {
            data: { access_token: oauthToken },
        } = await axios.post<{
            access_token: string;
            token_type: string;
        }>(`https://api.twitter.com/oauth2/token?grant_type=client_credentials`, null, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${api_key}:${api_secret_key}`).toString("base64")}`,
            },
        });

        return (this.oAuthToken = oauthToken);
    };

    getTweetData = async (tweetId = "1245700771485609984"): Promise<TwitterData> => {
        if (!this.oAuthToken) {
            await this.getOAuthToken();
        }
        const { data } = await axios.get<typeof tweetData>(
            `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}`,
            {
                headers: {
                    Authorization: `Bearer ${this.oAuthToken}`,
                },
            },
        );
        console.debug("Twitter Data: ", JSON.stringify(data, null, 2));
        const images = new Set<string>([
            ...data.extended_entities.media.map(({ media_url }) => media_url),
            ...data.entities.media.map(({ media_url }) => media_url),
        ]);
        console.log("asdf: ", Array.from(images));
        if (!images.size) {
            throw new Error("Unable to get image data from Twitter");
        }
        const hashtags = data.entities.hashtags?.map(h => h.text);
        return {
            hashtags,
            images: Array.from(images),
            creator: {
                screen_name: data.user.screen_name,
                avatar: data.user.profile_image_url,
            },
            twitterDescription: data.text,
        };
    };
}

export const twitterApi = new Twitter();
