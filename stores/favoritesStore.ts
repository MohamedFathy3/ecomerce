import { FavoriteItem } from "@/types";
import { create } from "zustand";

type favoriteStore = {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (item: FavoriteItem) => void;
};

const useFavoritesStore = create<favoriteStore>((set) => ({
  favorites: [],
  addFavorite: (item) =>
    set((state) => ({
      favorites: [...state.favorites, item],
    })),
  removeFavorite: (item) =>
    set((state) => ({
      favorites: state.favorites.filter((fav) => fav !== item),
    })),
}));

export default useFavoritesStore;
