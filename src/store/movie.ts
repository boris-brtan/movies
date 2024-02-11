import sagaMiddleware from 'zustand-saga'
import { createJSONStorage, persist } from 'zustand/middleware'
import { ERROR_DELAY, create } from './util'
import { Movie, MovieItem } from '../api'
import { MOVIE_ACTIONS, saga } from '../sagas/movie'

export interface MovieStore {
    /**
     * Search query string.
     */
    search: string

    /**
     * Retrieved info of movies.
     */
    movies: MovieItem[]

    /**
     * Count of found movie or tv show entries.
     */
    totalResults: number

    /**
     * Current movie or tv show list page.
     */
    page: number

    /**
     * Retrieved detailed info of movie or tv show.
     */
    movie?: Movie

    /**
     * Received error message.
     */
    error?: string

    /**
     * Requests movie info to show.
     *
     * @param id imdb identification or movie or tv show
     */
    fetchMovie(id?: string): void

    /**
     * Requests list of movies or tv shows to show.
     *
     * @param search pattern to be searched
     * @param page offset for search list
     */
    fetchMovies(search: string, page?: number): void

    /**
     * Requests for next page of search results.
     */
    loadNextPage(): void

    /**
     * Displays error alert in case of some error for 1.5 seconds.
     *
     * @param error message to be displayed
     */
    showError(error: string): void
}

const name = 'MovieStore'

export const useMovieStore = create<MovieStore>(
    persist(
        sagaMiddleware<MovieStore>(saga,
            (set: (state: Partial<MovieStore>, replace?: boolean, label?: string) => void, get: () => MovieStore, store) => ({
                search: '',
                movie: undefined,
                movies: [],
                page: 1,
                totalResults: 0,
                error: undefined,

                fetchMovie(id: string) {
                    set({ movie: undefined }, undefined, 'clear movie')
                    store.putActionToSaga({ type: MOVIE_ACTIONS.FETCH_MOVIE, id })
                },
                fetchMovies(search, page = 1) {
                    store.putActionToSaga({ type: MOVIE_ACTIONS.FETCH_MOVIES, search, page })
                },
                loadNextPage() {
                    const { search, page } = get()
                    store.putActionToSaga({ type: MOVIE_ACTIONS.FETCH_MOVIES_NEXT_PAGE, search, page: page + 1 })
                },
                showError(error: string) {
                    set({ error }, undefined, 'showError')
                    setTimeout(() => set({ error: undefined }), ERROR_DELAY)
                },
            }),
        ),
        {
            name,
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
    name,
)
