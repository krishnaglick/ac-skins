import { TwitterOutfit } from "../pages/api/save-outfit";

export function isTwitterOutfit(v: any): v is TwitterOutfit {
    return v.images?.length && v.creator?.screen_name && v.creator?.avatar && v.twitterDescription;
}
