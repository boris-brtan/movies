import '@testing-library/jest-dom'
import { cleanup, render } from '@testing-library/react'
import { Poster } from './Poster'

describe('Poster component', () => {
    afterEach(cleanup)

    it('should render fallback image correctly', () => {
        const { getByTestId } = render(<Poster src="N/A" />)

        expect(getByTestId('LocalMoviesIcon')).toBeVisible()
    })

    // TODO: enhance basic unit tests
})
