import { act, cleanup, renderHook } from '@testing-library/react'
import { useFavoriteStore } from './favorite'
import { MovieItem } from '../api'

describe('favorite store', () => {
    afterEach(cleanup)

    it('should add/remove movie from favorites', () => {
        const movieItem = { imdbID: 'imdbID' } as MovieItem
        const { result } = renderHook(() => useFavoriteStore())
        const { favorites, isFavorite, toggleFavorite } = result.current

        expect(favorites.length).toBe(0)

        act(() => {
            toggleFavorite(movieItem)
        })

        expect(isFavorite(movieItem)).toBeTruthy()
        expect(result.current.favorites.length).toBe(1)

        act(() => {
            toggleFavorite(movieItem)
        })

        expect(isFavorite(movieItem)).not.toBeTruthy()
    })
})
