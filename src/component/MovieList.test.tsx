import '@testing-library/jest-dom'
import { cleanup, render } from '@testing-library/react'
import MovieList from './MovieList'

describe('MovieList component', () => {
    afterEach(cleanup)

    it('should render empty state correctly', async () => {
        const { findByText } = render(<MovieList />)

        expect(await findByText('No results available', { exact: false })).toBeVisible()
    })

    // TODO: enhance basic unit tests
})
