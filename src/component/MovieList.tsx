import { Block } from '@mui/icons-material'
import { Button, Icon, Typography } from '@mui/material'
import { moviesAtom } from '../store/movieAtom'
import { MovieCard } from './MovieCard'
import { useAtomValue } from 'jotai'
import { useLayoutEffect, useRef } from 'react'

function EmptyBox() {
    return <Icon className="empty-state">
        <Block />
        <Typography fontSize="large">No results available.<br />Search action or term is required.</Typography>
    </Icon>
}

function LoadMore() {
    const { hasNextPage, fetchNextPage } = useAtomValue(moviesAtom)
    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const intersectionObserver = new IntersectionObserver((entries) => {
            if (entries[0].intersectionRatio > 0) {
                fetchNextPage()
            }
        })
        if (containerRef.current) {
            intersectionObserver.observe(containerRef.current)
        }
        return () => {
            intersectionObserver.disconnect()
        }
    }, [fetchNextPage])

    if (hasNextPage) {
        return <center ref={containerRef}>
            <Button onClick={() => fetchNextPage()}>Load next page</Button>ň
        </center>
    }
    return <></>
}

/**
 * Renders list of retrieved movies or tv shows.
 */
export default function MovieList(): JSX.Element {
    const { data: movies, isFetchingNextPage } = useAtomValue(moviesAtom)

    if (!movies.length) {
        return <EmptyBox />
    }

    return <>
        {movies.map((movie) => <MovieCard key={movie.imdbID} {...movie} />)}
        {!isFetchingNextPage && <LoadMore />}
    </>
}
