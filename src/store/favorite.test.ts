import { act, cleanup, renderHook } from '@testing-library/react'
import { MovieItem } from '../api'
import { useAtom } from 'jotai'
import { favoriteAtom, isFavorite } from './favoriteAtom'

describe('favorite store', () => {
    afterEach(cleanup)

    it('should add/remove movie from favorites', () => {
        const movieItem = { imdbID: 'imdbID' } as MovieItem
        const { result } = renderHook(() => useAtom(favoriteAtom))
        const [favorites, toggleFavorite] = result.current

        expect(favorites.length).toBe(0)

        act(() => {
            toggleFavorite(movieItem)
        })

        expect(isFavorite(movieItem)).toBeTruthy()
        expect(result.current[0].length).toBe(1)

        act(() => {
            toggleFavorite(movieItem)
        })

        expect(isFavorite(movieItem)).not.toBeTruthy()
    })
})
