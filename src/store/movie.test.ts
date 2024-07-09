import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import * as Api from '../api'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { errorAtom, movieAtom, movieIdAtom, moviesAtom, searchAtom } from './movieAtom'

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
        const { result: searchStore } = renderHook(() => useAtom(searchAtom))
        const [, setSearch] = searchStore.current

        act(() => {
            setSearch('The Movie search query')
        })

        const { result: movieStore } = renderHook(() => useAtomValue(moviesAtom))

        await waitFor(() => {
            expect(movieStore.current.data.length).toEqual(1)
            expect(movieStore.current.data[0].imdbID).toEqual('imdbID')
        })
    })

    // it('should load next movies page', async () => {
    //     jest.spyOn(Api, 'fetchMovies').mockReturnValue(Promise.resolve({ Search: Array(10).fill(movieItem), totalResults: 11 }))
    //     const { result: searchStore } = renderHook(() => useSetAtom(searchAtom))
    //     const { result: movieStore } = renderHook(() => useAtomValue(moviesAtom))

    //     act(() => {
    //         searchStore.current('The Movie search query')
    //     })

    //     await waitFor(() => {
    //         expect(movieStore.current.data.length).toEqual(10)
    //     })

    //     jest.spyOn(Api, 'fetchMovies').mockReturnValue(Promise.resolve({ Search: [movieItem], totalResults: 11 }))

    //     act(() => {
    //         movieStore.current.fetchNextPage()
    //     })

    //     await waitFor(() => {
    //         expect(movieStore.current.data.length).toEqual(11)
    //     })
    // })

    // it('should load movie detail', async () => {
    //     jest.spyOn(Api, 'fetchMovie').mockReturnValue(Promise.resolve(movieItem as Api.Movie))
    //     const { result: idStore } = renderHook(() => useSetAtom(movieIdAtom))
    //     const { result: movieStore } = renderHook(() => useAtomValue(movieAtom))

    //     expect(movieStore.current).not.toBeDefined()

    //     act(() => {
    //         idStore.current('imdbID')
    //     })

    //     await waitFor(() => {
    //         expect(movieStore.current.data).toBeDefined()
    //         expect(movieStore.current.data?.Title).toEqual('title')
    //     })
    // })

    // it('should process error message', async () => {
    //     jest.spyOn(Api, 'fetchMovies').mockReturnValue(Promise.resolve({ Error: '!!!error from service!!!' } as Api.FetchMoviesResult))
    //     jest.spyOn(Api, 'fetchMovie').mockReturnValue(Promise.resolve({ Error: '!!error from service!!' } as Api.FetchMovieResult))
    //     const { result: idStore } = renderHook(() => useSetAtom(movieIdAtom))
    //     const { result: searchStore } = renderHook(() => useSetAtom(searchAtom))
    //     const { result: errorStore } = renderHook(() => useSetAtom(errorAtom))
    //     const { result: movieStore } = renderHook(() => useAtomValue(movieAtom))
    //     const { result: moviesStore } = renderHook(() => useAtomValue(moviesAtom))

    //     expect(movieStore.current.error).not.toBeDefined()

    //     act(() => {
    //         idStore.current('The Movie search query')
    //     })

    //     await waitFor(() => {
    //         expect(errorStore.current).toBe('!!!error from service!!!')
    //     })

    //     await waitFor(() => {
    //         expect(errorStore.current).not.toBeDefined()
    //     })

    //     act(() => {
    //         moviesStore.current.fetchNextPage()
    //     })

    //     await waitFor(() => {
    //         expect(errorStore.current).toBe('!!!error from service!!!')
    //     })

    //     await waitFor(() => {
    //         expect(errorStore.current).not.toBeDefined()
    //     })

    //     act(() => {
    //         searchStore.current('imdbID')
    //     })

    //     await waitFor(() => {
    //         expect(errorStore.current).toBe('!!error from service!!')
    //     })

    //     await waitFor(() => {
    //         expect(errorStore.current).not.toBeDefined()
    //     })
    // })
})
