import '@testing-library/jest-dom'
import { cleanup, render } from '@testing-library/react'
import MovieDetail from './MovieDetail'
import { movieIdAtom } from '../store'
import { Movie } from '../api'
import { getDefaultStore } from 'jotai'
import * as Api from '../api'

const store = getDefaultStore()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn().mockReturnValue({ id: 'imdbID' }),
}))

jest.spyOn(Api, 'fetchMovie').mockResolvedValue({ imdbID: 'imdbID', Title: 'movie title', Poster: 'N/A', Country: 'country' } as Movie)

describe('MovieDetail component', () => {
    afterEach(cleanup)
    store.set(movieIdAtom, 'imdbID')

    it('should render correctly', async () => {
        const { findByText } = render(<MovieDetail />)

        expect(await findByText('movie title')).toBeVisible()

        const imdbLink = await findByText('IMDb')
        expect(imdbLink).toBeVisible()
        expect(imdbLink.tagName).toEqual('BUTTON')
    })

    // TODO: enhance basic unit tests
})
