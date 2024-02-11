import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from './util'
import { MovieItem } from '../api'

export interface FavoriteStore {
    /**
     * Favorite movies picked from search list.
     */
    favorites: MovieItem[],

    /**
     * Adds or removes {@link MovieItem}.
     *
     * @param movieItem movie or tv show to add or remove
     */
    toggleFavorite(movieItem: MovieItem): void

    /**
     * Checks whether movie or tv show is part of favorite list.
     *
     * @param movieItem movie or tv show to search for
     */
    isFavorite(movieItem?: MovieItem): boolean
}

const name = 'FavoriteStore'

export const useFavoriteStore = create<FavoriteStore>(
    persist(
        (set, get) => ({
            favorites: [],

            toggleFavorite(movieItem: MovieItem) {
                const favorites = get().favorites
                const favoriteIdx = favorites.findIndex(({ imdbID }) => imdbID === movieItem.imdbID)
                if (favoriteIdx > -1) {
                    set({ favorites: favorites.toSpliced(favoriteIdx, 1) }, undefined, 'removeFavorite')
                    return
                }
                set({ favorites: [...favorites, movieItem] }, undefined, 'addFavorite')
            },

            isFavorite(movieItem?: MovieItem) {
                if (!movieItem) {
                    return false
                }

                return get().favorites.some(({ imdbID }) => imdbID === movieItem.imdbID)
            },
        }),
        {
            name,
            storage: createJSONStorage(() => localStorage),
        },
    ),
    name,
)
