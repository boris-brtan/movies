import { act, renderHook, waitFor } from '@testing-library/react'
import { PaletteMode } from '@mui/material'
import { useAtom, useAtomValue } from 'jotai'
import { themeAtom } from './themeAtom'

describe('theme store', () => {
    it('should set theme palette to dark mode by default', () => {
        const { result } = renderHook(() => useAtomValue(themeAtom))

        expect(result.current).toEqual('dark')
    })

    it.each([
        ['light', 'light'],
        ['dark', 'dark'],
        ['light', undefined],
        ['dark', undefined],
    ] as PaletteMode[][])('should toggle current theme palette to %s mode', async (resultMode, mode) => {
        const { result } = renderHook(() => useAtom(themeAtom))

        act(() => {
            const [, toggleMode] = result.current
            toggleMode(mode)
        })

        await waitFor(() => {
            const [mode] = result.current
            expect(mode).toEqual(resultMode)
        })
    })
})
