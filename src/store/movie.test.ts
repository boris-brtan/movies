import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { useMovieStore } from './movie'
import * as Api from '../api'

const movieItem: Api.MovieItem = {
    imdbID: 'imdbID',
    Type: 'movie',
    Title: 'title',
    Year: 1111,
    Poster: 'imageUrl',
}

jest.mock('./util', () => ({
    ...jest.requireActual('./util'),
    ERROR_DELAY: 100,
}))

describe('movie store', () => {
    afterEach(cleanup)

    it('should load movies', async () => {
        jest.spyOn(Api, 'fetchMovies').mockReturnValue(Promise.resolve({ Search: [movieItem], totalResults: 1 }))
        const { result } = renderHook(() => useMovieStore())

        act(() => {
            result.current.fetchMovies('The Movie search query')
        })

        await waitFor(() => {
            expect(result.current.movies.length).toEqual(1)
            expect(result.current.movies[0].imdbID).toEqual('imdbID')
        })
    })

    it('should load next movies page', async () => {
        jest.spyOn(Api, 'fetchMovies').mockReturnValue(Promise.resolve({ Search: Array(10).fill(movieItem), totalResults: 11 }))
        const { result } = renderHook(() => useMovieStore())

        act(() => {
            result.current.fetchMovies('The Movie search query')
        })

        await waitFor(() => {
            expect(result.current.movies.length).toEqual(10)
            expect(result.current.page).toEqual(1)
        })

        jest.spyOn(Api, 'fetchMovies').mockReturnValue(Promise.resolve({ Search: [movieItem], totalResults: 11 }))

        act(() => {
            result.current.loadNextPage()
        })

        await waitFor(() => {
            expect(result.current.movies.length).toEqual(11)
            expect(result.current.page).toEqual(2)
        })
    })

    it('should load movie detail', async () => {
        jest.spyOn(Api, 'fetchMovie').mockReturnValue(Promise.resolve(movieItem as Api.Movie))
        const { result } = renderHook(() => useMovieStore())

        expect(result.current.movie).not.toBeDefined()

        act(() => {
            result.current.fetchMovie('imdbID')
        })

        await waitFor(() => {
            expect(result.current.movie).toBeDefined()
            expect(result.current.movie?.Title).toEqual('title')
        })
    })

    it('should process error message', async () => {
        jest.spyOn(Api, 'fetchMovies').mockReturnValue(Promise.resolve({ Error: '!!!error from service!!!' } as Api.FetchMoviesResult))
        jest.spyOn(Api, 'fetchMovie').mockReturnValue(Promise.resolve({ Error: '!!error from service!!' } as Api.FetchMovieResult))
        const { result } = renderHook(() => useMovieStore())

        expect(result.current.error).not.toBeDefined()

        act(() => {
            result.current.fetchMovies('The Movie search query')
        })

        await waitFor(() => {
            expect(result.current.error).toBe('!!!error from service!!!')
        })

        await waitFor(() => {
            expect(result.current.error).not.toBeDefined()
        })

        act(() => {
            result.current.loadNextPage()
        })

        await waitFor(() => {
            expect(result.current.error).toBe('!!!error from service!!!')
        })

        await waitFor(() => {
            expect(result.current.error).not.toBeDefined()
        })

        act(() => {
            result.current.fetchMovie('imdbID')
        })

        await waitFor(() => {
            expect(result.current.error).toBe('!!error from service!!')
        })

        await waitFor(() => {
            expect(result.current.error).not.toBeDefined()
        })
    })
})
