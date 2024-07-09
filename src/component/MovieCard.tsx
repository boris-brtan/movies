import { memo, useCallback, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { Box, Card, CardActionArea, CardActions, CardContent, IconButton, Typography } from '@mui/material'
import { Star, StarBorder } from '@mui/icons-material'
import { MovieItem } from '../api'
import { useRedirect } from '../util'
import { Poster } from './Poster'
import { favoriteAtom, isFavorite } from '../store'

function FavoriteButton(movie: MovieItem) {
    const toggleFavorite = useSetAtom(favoriteAtom)
    const isFavoriteMovie = useAtomValue(useMemo(() => selectAtom(favoriteAtom, () => isFavorite(movie)), [movie]))

    return <IconButton
        size="small"
        color="warning"
        title="Add to favorites"
        onClick={() => toggleFavorite(movie)}
    >
        {isFavoriteMovie ? <Star /> : <StarBorder />}
    </IconButton>
}

/**
 * Renders item for {@link MovieList} or {@link FavoriteList}.
 *
 * @param item movie or tv show list item data
 */
export const MovieCard = memo(function MovieCard(props: MovieItem) {
    const redirect = useRedirect()
    const onCardClick = useCallback(() => redirect('/movie/' + props.imdbID), [props.imdbID, redirect])

    return <Card className="list-item">
        <CardActionArea onClick={onCardClick}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Poster src={props.Poster} />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">{props.Title}</Typography>
                    <Typography variant="body2" color="text.secondary">{props.Year}</Typography>
                </CardContent>
            </Box>
        </CardActionArea>
        <CardActions>
            <FavoriteButton {...props} />
        </CardActions>
    </Card>
})
