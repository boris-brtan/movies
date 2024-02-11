import { act, renderHook, waitFor } from '@testing-library/react'
import { PaletteMode } from '@mui/material'
import { useThemeStore } from './theme'

describe('theme store', () => {
    it('should set theme palette to dark mode by default', () => {
        const { result } = renderHook(() => useThemeStore())

        expect(result.current.mode).toEqual('dark')
    })

    it.each([
        ['light', 'light'],
        ['dark', 'dark'],
        ['light', undefined],
        ['dark', undefined],
    ] as PaletteMode[][])('should toggle current theme palette to %s mode', async (resultMode, mode) => {
        const { result } = renderHook(() => useThemeStore())

        act(() => {
            result.current.toggleMode(mode)
        })

        await waitFor(() => {
            expect(result.current.mode).toEqual(resultMode)
        })
    })
})
