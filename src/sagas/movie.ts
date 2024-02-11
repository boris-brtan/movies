import { call, race, select, takeLatest } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { setState } from 'zustand-saga'
import { fetchMovie, fetchMovies } from '../api'
import { MovieStore } from '../store/movie'

export enum MOVIE_ACTIONS {
    FETCH_MOVIE = 'FETCH_MOVIE',
    FETCH_MOVIES = 'FETCH_MOVIES',
    FETCH_MOVIES_NEXT_PAGE = 'FETCH_MOVIES_NEXT_PAGE',
}

export interface FetchMovieAction {
    type: MOVIE_ACTIONS.FETCH_MOVIE
    id: string
}

export interface FetchMoviesAction {
    type: MOVIE_ACTIONS.FETCH_MOVIES
    search: string
    page: number
}

function* showError(message: string) {
    ((yield select<(state: MovieStore) => void>((state: MovieStore) => state.showError)) as MovieStore['showError'])(message)
}

function* fetchMovieAction({ id }: FetchMovieAction) {
    try {
        const movie = (yield call<typeof fetchMovie>(fetchMovie, id)) as Awaited<ReturnType<typeof fetchMovie>>

        if(movie.Error) {
            throw movie.Error
        }

        yield setState({ movie })
    } catch (message) {
        yield showError(message as string)
    }
}

function* fetchMoviesAction({ search, page = 1 }: FetchMoviesAction) {
    try {
        const { Search: movies = [], totalResults = 0, Error } = (yield call<typeof fetchMovies>(fetchMovies, search, page)) as Awaited<ReturnType<typeof fetchMovies>>

        if (Error) {
            throw Error
        }

        yield setState({ movies, totalResults, page, search }, undefined, 'fetchMovies')
    } catch (message) {
        yield showError(message as string)
    }
}

function* fetchMoviesNextPageAction({ search, page }: FetchMoviesAction) {
    try {
        const { Search: movies = [], Error } = (yield call<typeof fetchMovies>(fetchMovies, search, page)) as Awaited<ReturnType<typeof fetchMovies>>

        if (Error) {
            throw Error
        }

        yield setState((state: MovieStore) => ({ movies: [...state.movies, ...movies], page: state.page + 1 }), undefined, 'nextPage')
    } catch (message) {
        yield showError(message as string)
    }
}

export function* saga(): SagaIterator {
    yield race([
        yield takeLatest(MOVIE_ACTIONS.FETCH_MOVIE, fetchMovieAction),
        yield takeLatest(MOVIE_ACTIONS.FETCH_MOVIES, fetchMoviesAction),
        yield takeLatest(MOVIE_ACTIONS.FETCH_MOVIES_NEXT_PAGE, fetchMoviesNextPageAction),
    ])
}
