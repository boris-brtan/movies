import { useCallback, useEffect } from 'react'
import { Block, Star, StarBorder } from '@mui/icons-material'
import { Box, Button, Card, CardActionArea, CardActions, CardContent, Icon, IconButton, Typography } from '@mui/material'
import { useMovieStore } from '../store/movie'
import { MovieItem } from '../api'
import { useFavoriteStore } from '../store/favorite'
import { useRedirect } from '../util'
import { Poster } from './Poster'

function loadNextPage() {
    useMovieStore.getState().loadNextPage()
}

function MovieCard(item: MovieItem) {
    const [isFavorite, toggleFavorite] = useFavoriteStore((state) => [
        state.isFavorite(item),
        () => state.toggleFavorite(item),
    ])
    const redirect = useRedirect()
    const onCardClick = useCallback(() => redirect('/movie/' + item.imdbID), [item.imdbID, redirect])

    return <Card className="list-item">
        <CardActionArea onClick={onCardClick}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Poster src={item.Poster} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">{item.Title}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.Year}</Typography>
                </CardContent>
            </Box>
        </CardActionArea>
        <CardActions>
            <IconButton size="small" color="warning" title="Add to favorites" onClick={toggleFavorite}>
                {isFavorite ? <Star /> : <StarBorder />}
            </IconButton>
        </CardActions>
    </Card>
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
export function MovieList(): JSX.Element {
    const [movies, hasNextPage] = useMovieStore(state => [state.movies, state.totalResults > state.page * 10])

    if (!movies.length) {
        return <EmptyBox />
    }

    return <>
        {movies.map((movie) => <MovieCard key={movie.imdbID} {...movie} />)}
        {hasNextPage && <center><Button onClick={loadNextPage}>Load next page</Button></center>}
    </>
}

/**
 * Renders user picked favorite list of retrieved movies or tv shows.
 */
export function FavoriteList(): JSX.Element {
    const favorites = useFavoriteStore((state) => state.favorites)
    const redirect = useRedirect()

    useEffect(() => {
        if (!favorites.length) {
            redirect('/')
        }
    }, [favorites.length, redirect])

    return <>{favorites.map((movie) => <MovieCard key={movie.imdbID} {...movie} />)}</>
}
