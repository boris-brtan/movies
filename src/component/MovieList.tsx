import { Block } from '@mui/icons-material'
import { Button, Icon, Typography } from '@mui/material'
import { useMovieStore } from '../store/movie'
import { MovieCard } from './MovieCard'

function loadNextPage() {
    useMovieStore.getState().loadNextPage()
}

function EmptyBox() {
    return <Icon className="empty-state">
        <Block />
        <Typography fontSize="large">No results available.<br />Search action is required.</Typography>
    </Icon>
}

/**
 * Renders list of retrieved movies or tv shows.
 */
export default function MovieList(): JSX.Element {
    const [movies, hasNextPage] = useMovieStore(state => [state.movies, state.totalResults > state.page * 10])

    if (!movies.length) {
        return <EmptyBox />
    }

    return <>
        {movies.map((movie) => <MovieCard key={movie.imdbID} {...movie} />)}
        {hasNextPage && <center><Button onClick={loadNextPage}>Load next page</Button></center>}
    </>
}
