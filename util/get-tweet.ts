import axios from "axios";

import tweetData from "../data.json";
import { api_key, api_secret_key } from "../env.json";
import type { TwitterData } from "../pages/api/save-outfit";

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
        const hashtags = data.entities.hashtags.map(h => h.text);
        const images = data.entities.media.map(media => media.media_url);
        return {
            hashtags,
            images,
            creator: {
                screen_name: data.user.screen_name,
                avatar: data.user.profile_image_url,
            },
            twitterDescription: data.text,
        };
    };
}

export const twitterApi = new Twitter();
