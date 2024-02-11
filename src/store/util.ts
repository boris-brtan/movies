import { StateCreator, create as createStore } from 'zustand'
import { devtools } from 'zustand/middleware'

export const ERROR_DELAY = 1500

export function create<T>(creator: StateCreator<T, [['zustand/devtools', never]], [['zustand/persist', unknown]]>, name: string) {
    return createStore<T>()(
        devtools(
            creator,
            { name, enabled: process.env.NODE_ENV === 'dev' },
        ),
    )
}
