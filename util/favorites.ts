// import { DesignData } from "../pages/api/save-design";

type DesignData = any;

class Favorites {
    static localStorageKey = "savedFavorites";
    private favorites: { [key: string]: DesignData } = {};
    constructor() {
        if (typeof localStorage !== "undefined") {
            try {
                this.favorites = JSON.parse(localStorage.getItem(Favorites.localStorageKey) || "{}");
            } catch (err) {
                console.warn("Favorites saved data is malformed");
            }
        }
    }

    private saveFavorites() {
        if (typeof localStorage !== "undefined") {
            localStorage.setItem(Favorites.localStorageKey, JSON.stringify(this.favorites));
        }
    }

    addFavorite(favorite: DesignData) {
        this.favorites[favorite.designId] = favorite;
        this.saveFavorites();
    }
    removeFavorite(favorite: DesignData) {
        delete this.favorites[favorite.designId];
        this.saveFavorites();
    }
    getFavorites() {
        return Object.values(this.favorites);
    }
    hasFavorite(favorite: DesignData) {
        return Boolean(this.favorites[favorite.designId]);
    }
}

export const favorites = new Favorites();
