import { useEffect } from 'react'
import { favoriteAtom } from '../store'
import { useRedirect } from '../util'
import { MovieCard } from './MovieCard'
import { useAtomValue } from 'jotai'

/**
 * Renders user picked favorite list of retrieved movies or tv shows.
 */
export default function FavoriteList(): JSX.Element {
    const favorites = useAtomValue(favoriteAtom)
    const redirect = useRedirect()

    useEffect(() => {
        if (!favorites.length) {
            redirect('/')
        }
    }, [favorites.length, redirect])

    return <>{favorites.map((movie) => <MovieCard key={movie.imdbID} {...movie} />)}</>
}
