import { PaletteMode } from '@mui/material'
import sagaMiddleware from 'zustand-saga'
import { createJSONStorage, persist } from 'zustand/middleware'
import { THEME_ACTIONS, saga } from '../sagas/theme'
import { create } from './util'

export interface ThemeStore {
    /**
     * Current theme palette mode.
     */
    mode: PaletteMode

    /**
     * Sets or toogles current theme palette mode.
     *
     * @param mode palette mode for theme
     */
    toggleMode(mode?: PaletteMode): void
}

const name = 'ThemeStore'

export const useThemeStore = create<ThemeStore>(
    persist(
        sagaMiddleware<ThemeStore>(saga,
            (_set, _get, store) => ({
                mode: 'dark',

                toggleMode(mode?: PaletteMode) {
                    store.putActionToSaga({ type: THEME_ACTIONS.TOGGLE_MODE, mode })
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
