import { useCallback, useEffect } from 'react'
import { pick } from 'lodash'
import { useParams } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'
import { Button, Card, CardContent, IconButton, Rating, Typography } from '@mui/material'
import { Poster } from './Poster'
import { Star, StarBorder } from '@mui/icons-material'
import { MovieItem } from '../api'
import { useMovieStore } from '../store/movie'
import { useFavoriteStore } from '../store/favorite'
import { Loader } from './Loader'

/**
 * Renders retrieved movie or tv show info.
 */
export default function MovieDetail() {
    const { id } = useParams()
    const [movie, fetchMovie] = useMovieStore(useShallow(state => [state.movie, state.fetchMovie]))
    const [isFavorite, toggleFavorite] = useFavoriteStore(useShallow(state => [
        state.isFavorite(movie),
        () => state.toggleFavorite(pick<MovieItem>(movie, 'Type', 'imdbID', 'Title', 'Year', 'Poster') as MovieItem),
    ]))
    const onImdbClick = useCallback(() => {
        window.location.href = '//www.imdb.com/title/' + movie?.imdbID
    }, [movie?.imdbID])

    useEffect(() => {
        // use non-reactive movie getter to call endpoint just once
        if (useMovieStore.getState().movie?.imdbID !== id) {
            fetchMovie(id)
        }
    }, [fetchMovie, id])

    if (!movie) {
        return <Loader />
    }

    return <Card className="detail">
        <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
                {movie.Title}
                <IconButton size="large" color="warning" title="Add to favorites" onClick={toggleFavorite}>
                    {isFavorite ? <Star /> : <StarBorder />}
                </IconButton>
                <Button variant="contained" color="warning" onClick={onImdbClick}>IMDb</Button>
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {movie.Country} {movie.Year}
            </Typography>
            <center>
                <Poster src={movie.Poster} />
                <Rating
                    size="small"
                    readOnly
                    precision={0.1}
                    value={movie.imdbRating / 2}
                />
            </center>
            <Typography paragraph>{movie.Plot}</Typography>
        </CardContent>
    </Card>
}
