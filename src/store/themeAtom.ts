import { PaletteMode } from '@mui/material'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import React from 'react'

const name = 'ThemeAtom'
const colorThemes: PaletteMode[] = ['dark', 'light']

const persistAtom = atomWithStorage<PaletteMode>(name, 'dark')
export const themeAtom = atom(
    (get) => get(persistAtom),
    (get, set, value?: PaletteMode) => {
        if (!value) {
            const currentTheme = get(persistAtom)
            set(persistAtom, currentTheme === 'dark' ? 'light' : 'dark')
        } else if (colorThemes.includes(value)) {
            set(persistAtom, value)
        }
    },
)
themeAtom.debugLabel = name
