import axios from "axios";

import tweetData from "../data.json";
import type { TwitterData } from "../pages/api/save-design";
import { getEnvironmentValue } from "./env";

class Twitter {
    oAuthToken = "";
    getOAuthToken = async () => {
        const api_key = getEnvironmentValue("api_key");
        const api_secret_key = getEnvironmentValue("api_secret_key");
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
            `https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}&include_entities=true&extended_tweet=true&tweet_mode=extended`,
            {
                headers: {
                    Authorization: `Bearer ${this.oAuthToken}`,
                },
            },
        );
        console.debug("Twitter Data: ", JSON.stringify(data, null, 2));
        if (!data.extended_entities?.media || !data.entities?.media) {
            throw new Error("No image data available from twitter, please try linking the image directly");
        }
        const images = new Set<string>([
            ...data.extended_entities?.media.map(({ media_url }) => media_url),
            ...data.entities?.media.map(({ media_url }) => media_url),
        ]);

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
