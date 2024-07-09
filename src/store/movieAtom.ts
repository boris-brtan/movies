import { ERROR_DELAY } from './util'
import { Movie, MovieItem, fetchMovie, fetchMovies } from '../api'
import { atomWithSuspenseInfiniteQuery, atomWithSuspenseQuery } from 'jotai-tanstack-query'
import { DefaultError, QueryKey } from '@tanstack/query-core'
import { atom, getDefaultStore } from 'jotai'

const name = 'MovieStore'

/**
 * Search query string.
 */
export const searchAtom = atom('')
export const totalResultsAtom = atom(0)
export const moviesAtom = atomWithSuspenseInfiniteQuery<MovieItem[], DefaultError, MovieItem[], QueryKey, number>((get) => ({
    queryKey: ['movies'],
    async queryFn({ pageParam, signal }) {
        if (get(searchAtom).length > 2) {
            const { Search, totalResults = 0, Error = undefined } = await fetchMovies(get(searchAtom), signal, pageParam)
            getDefaultStore().set(totalResultsAtom, totalResults)
            if (Error) {
                return []
            }

            return Search
        }

        return []
    },
    select: ({ pages }) => pages.flatMap(movieItem => movieItem),
    getNextPageParam(_lastPage, allPages, lastPageParam) {
        if (lastPageParam * allPages[0].length < get(totalResultsAtom)) {
            return lastPageParam + 1
        }

        return undefined
    },
    initialPageParam: 1,
}))
moviesAtom.debugLabel = name

export const movieIdAtom = atom<string | undefined>(undefined)
movieIdAtom.debugLabel = [name, 'id'].join('.')

export const movieAtom = atomWithSuspenseQuery<Movie | undefined, DefaultError, Movie, [string, string | undefined]>((get) => ({
    queryKey: ['movies', get(movieIdAtom)],
    async queryFn({ queryKey: [, id] }) {
        if (id) {
            return (await fetchMovie(id)) as Movie
        }

        return undefined
    },
}))
movieAtom.debugLabel = [name, 'detail'].join('.')

export const errorValueAtom = atom<unknown>(undefined)
export const errorAtom = atom(
    (get) => get(errorValueAtom),
    (_get, set, error) => {
        set(errorValueAtom, error)
        setTimeout(() => set(errorValueAtom, undefined), ERROR_DELAY)
    },
)
errorAtom.debugLabel = [name, 'error'].join('.')
