import { KeyboardEvent, Suspense, lazy, useCallback, useMemo } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { DarkMode, LightMode, Search, Star, StarBorder } from '@mui/icons-material'
import { Alert, AppBar, Badge, Box, CssBaseline, Icon, IconButton, InputBase, ThemeProvider, Toolbar, Tooltip, Typography, createTheme } from '@mui/material'
import { useFavoriteStore, useMovieStore, useThemeStore } from './store'
import { useRedirect } from './util'
import './App.scss'
import { Loader } from './component/Loader'

const FavoriteList = lazy(() => import('./component/FavoriteList'))
const MovieDetail = lazy(() => import('./component/MovieDetail'))
const MovieList = lazy(() => import('./component/MovieList'))

function PaletteModeButton() {
    const [mode, toggleMode] = useThemeStore((state) => [state.mode, () => state.toggleMode()])

    return <Tooltip title={`change to ${mode === 'dark' ? 'light' : 'dark'} theme mode`}>
        <IconButton onClick={toggleMode}>
            {mode === 'dark' ? <DarkMode /> : <LightMode />}
        </IconButton>
    </Tooltip>
}

function SearchBox() {
    const initialSearch = useMovieStore((state) => state.search)
    const redirect = useRedirect()
    const onSearch = useCallback(({ key, target }: KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
        if (key === 'Enter') {
            useMovieStore.getState().fetchMovies(target.value)
            redirect('/')
        }
    }, [redirect])

    return <Box className="search-input">
        <Icon><Search /></Icon>
        <InputBase autoFocus onKeyDown={onSearch} placeholder="Search…" defaultValue={initialSearch} inputProps={{ 'aria-label': 'search' }} />
    </Box>
}

function FavoriteLink() {
    const favoriteCount = useFavoriteStore((state) => state.favorites.length)
    const redirect = useRedirect()
    const gotoFavoriteList = useCallback(() => redirect('/favorite'), [redirect])

    return <IconButton
        disabled={favoriteCount === 0}
        className="favorite"
        onClick={gotoFavoriteList}
    >
        <Tooltip title="Go to favorite list">
            <Badge
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                badgeContent={favoriteCount}
                color="secondary"
            >
                {favoriteCount ? <Star /> : <StarBorder />}
            </Badge>
        </Tooltip >
    </IconButton>
}

function ErrorBox() {
    const error = useMovieStore(state => state.error)

    if (!error) {
        return <></>
    }

    return <Alert severity="error">{error}</Alert>
}

export function App() {
    const mode = useThemeStore((state) => state.mode)
    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

    return <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <Router>
            <AppBar position="sticky">
                <Toolbar>
                    <FavoriteLink />
                    <Typography
                        variant="h6"
                        noWrap
                        component="h1"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Movies & Tv shows
                    </Typography>
                    <SearchBox />
                    <PaletteModeButton />
                </Toolbar>
            </AppBar>
            <main>
                <ErrorBox />
                <Suspense fallback={<Loader />}>
                    <Routes>
                        <Route path="/" element={<MovieList />} />
                        <Route path="/favorite" element={<FavoriteList />} />
                        <Route path="/movie/:id" element={<MovieDetail />} />
                    </Routes>
                </Suspense>
            </main>
        </Router>
    </ThemeProvider>
}
