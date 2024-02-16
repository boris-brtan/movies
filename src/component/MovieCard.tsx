import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Box, Card, CardActionArea, CardActions, CardContent, IconButton, Typography } from '@mui/material'
import { Star, StarBorder } from '@mui/icons-material'
import { MovieItem } from '../api'
import { useFavoriteStore } from '../store'
import { useRedirect } from '../util'
import { Poster } from './Poster'

/**
 * Renders item for {@link MovieList} or {@link FavoriteList}.
 *
 * @param item movie or tv show list item data
 */
export function MovieCard(item: MovieItem) {
    const [isFavorite, toggleFavorite] = useFavoriteStore(useShallow((state) => [
        state.isFavorite(item),
        () => state.toggleFavorite(item),
    ]))
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
