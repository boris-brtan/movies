import { LocalMovies } from '@mui/icons-material'
import { CardMedia, CircularProgress, Icon } from '@mui/material'
import { useState } from 'react'

/**
 * Displays poster of movie or tv show with use of custom loader and special fallback poster.
 *
 * @param src url to poster
 */
export function Poster({ src }: { src: string }) {
    const [loadState, setLoadState] = useState<'load' | 'fallback' | ''>(src === 'N/A' ? 'fallback' : 'load')

    return <>
        {['load', 'fallback'].includes(loadState) &&
            <Icon className="poster">
                {loadState === 'load' && <CircularProgress />}
                <LocalMovies />
            </Icon>
        }
        {loadState !== 'fallback' &&
            <CardMedia
                className={['poster', loadState].filter(Boolean).join(' ')}
                component="img"
                image={src}
                aria-hidden
                onLoad={() => setLoadState('')}
                onError={() => setLoadState('fallback')}
            />
        }
    </>
}
