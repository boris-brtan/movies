import '@testing-library/jest-dom'
import { cleanup, render } from '@testing-library/react'
import { MovieDetail } from './MovieDetail'
import { useMovieStore } from '../store'
import { Movie } from '../api'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ id: 'imdbID' }),
}))

describe('MovieDetail component', () => {
    afterEach(cleanup)

    it('should render correctly', async () => {
        useMovieStore.setState({ movie: { imdbID: 'imdbID', Title: 'title', Poster: 'N/A', Country: 'country' } as Movie })

        const { findByText } = render(<MovieDetail />)

        const imdbLink = await findByText('IMDb')
        expect(imdbLink).toBeVisible()
        expect(imdbLink.tagName).toEqual('BUTTON')
    })

    // TODO: enhance basic unit tests
})
