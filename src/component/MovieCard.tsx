import { memo, useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Box, Card, CardActionArea, CardActions, CardContent, IconButton, Typography } from '@mui/material'
import { Star, StarBorder } from '@mui/icons-material'
import { MovieItem } from '../api'
import { useFavoriteStore } from '../store'
import { useRedirect } from '../util'
import { Poster } from './Poster'

function FavoriteButton(props: MovieItem) {
    const [isFavorite, toggleFavorite] = useFavoriteStore(useShallow((state) => [
        state.isFavorite(props),
        state.toggleFavorite,
    ]))

    return <IconButton
        size="small"
        color="warning"
        title="Add to favorites"
        onClick={() => toggleFavorite(props)}
    >
        {isFavorite ? <Star /> : <StarBorder />}
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
