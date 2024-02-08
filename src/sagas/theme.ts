import { debounce, select } from 'redux-saga/effects'
import { SagaIterator } from 'redux-saga'
import { setState } from 'zustand-saga'
import { ThemeStore } from '../store/theme'
import { PaletteMode } from '@mui/material'

export enum THEME_ACTIONS {
    TOGGLE_MODE = 'TOGGLE_MODE',
    LIGHT_MODE = 'LIGHT_MODE',
}

interface ToggleModeAction {
    type: THEME_ACTIONS.TOGGLE_MODE
    mode?: PaletteMode
}

function* toggleMode({ mode }: ToggleModeAction) {
    if (mode === undefined || !['light', 'dark'].includes(mode)) {
        mode = (yield select<(state: ThemeStore) => void>(state => state.mode)) as PaletteMode
        mode = mode === 'dark' ? 'light' : 'dark'
    }
    yield setState({ mode }, undefined, 'toogleMode')
}

export function* saga(): SagaIterator {
    yield debounce<ToggleModeAction>(200, THEME_ACTIONS.TOGGLE_MODE, toggleMode)
}
