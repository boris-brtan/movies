import { useCallback, useEffect, useMemo } from 'react'
import { pick } from 'lodash'
import { useParams } from 'react-router-dom'
import { Button, Card, CardContent, IconButton, Rating, Typography } from '@mui/material'
import { Poster } from './Poster'
import { Star, StarBorder } from '@mui/icons-material'
import { MovieItem } from '../api'
import { Loader } from './Loader'
import { useAtomValue, useSetAtom } from 'jotai'
import { favoriteAtom, isFavorite, movieAtom, movieIdAtom } from '../store'
import { selectAtom } from 'jotai/utils'

/**
 * Renders retrieved movie or tv show info.
 */
export default function MovieDetail() {
    const { id } = useParams()
    const { data: movie } = useAtomValue(movieAtom)
    const fetchMovie = useSetAtom(movieIdAtom)
    const toggleFavorite = useSetAtom(favoriteAtom)
    const toggleFavoriteHandler = useCallback(
        () => toggleFavorite(pick<MovieItem>(movie, 'Type', 'imdbID', 'Title', 'Year', 'Poster') as MovieItem),
        [movie, toggleFavorite],
    )
    const isFavoriteMovie = useAtomValue(
        useMemo(() => selectAtom(
            favoriteAtom,
            () => isFavorite(movie),
        ), [movie]),
    )
    const onImdbClick = useCallback(() => {
        if (movie?.imdbID) {
            window.location.href = '//www.imdb.com/title/' + movie?.imdbID
        }
    }, [movie?.imdbID])

    useEffect(() => {
        if (movie?.imdbID !== id) {
            fetchMovie(id)
        }
    }, [fetchMovie, id, movie])

    if (!movie) {
        return <Loader />
    }

    return <Card className="detail">
        <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
                {movie.Title}
                <IconButton size="large" color="warning" title="Add to favorites" onClick={toggleFavoriteHandler}>
                    {isFavoriteMovie ? <Star /> : <StarBorder />}
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
