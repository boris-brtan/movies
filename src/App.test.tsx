import '@testing-library/jest-dom'
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react'
import { App } from './App'

describe('App component', () => {
    afterEach(cleanup)

    it('should render correctly', async () => {
        const { findByText } = render(<App />)
        expect(await findByText('Movies & Tv shows')).toBeVisible()
        expect(await findByText('No results available', { exact: false })).toBeVisible()
    })

    it('should switch theme pallete mode', async () => {
        const { findByLabelText } = render(<App />)
        const paletteModeSwitch = await findByLabelText('change to light theme mode')
        expect(paletteModeSwitch).toBeVisible()

        act(() => {
            fireEvent.click(paletteModeSwitch)
        })

        await waitFor(() => {
            expect(paletteModeSwitch).toHaveAttribute('aria-label', 'change to dark theme mode')
        })

        act(() => {
            fireEvent.click(paletteModeSwitch)
        })

        await waitFor(() => {
            expect(paletteModeSwitch).toHaveAttribute('aria-label', 'change to light theme mode')
        })
    })
})
