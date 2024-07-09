import { atom, getDefaultStore } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { MovieItem } from '../api'

const name = 'FavoriteAtom'

const persistAtom = atomWithStorage<MovieItem[]>(name, [])
export const favoriteAtom = atom(
    /**
     * Favorite movies picked from search list.
     */
    (get) => get(persistAtom),
    /**
     * Adds or removes {@link MovieItem}.
     *
     * @param movieItem movie or tv show to add or remove
     */
    (get, set, movieItem: MovieItem) => {
        const favorites = get(persistAtom)
        const favoriteIdx = favorites.findIndex(({ imdbID }) => imdbID === movieItem.imdbID)
        if (favoriteIdx > -1) {
            set(persistAtom, favorites.toSpliced(favoriteIdx, 1))
            return
        }
        set(persistAtom, [...favorites, movieItem])
    },
)
favoriteAtom.debugLabel = name

/**
 * Checks whether movie or tv show is part of favorite list.
 *
 * @param movieItem movie or tv show to search for
 */
export function isFavorite(movieItem?: MovieItem) {
    if (!movieItem) {
        return false
    }

    return getDefaultStore().get(persistAtom).some(({ imdbID }) => imdbID === movieItem.imdbID)
}
