import { KeyboardEvent, Suspense, lazy, useCallback, useMemo } from 'react'
import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import { useAtom, useAtomValue } from 'jotai'
import { DarkMode, LightMode, Search, Star, StarBorder } from '@mui/icons-material'
import { Alert, AppBar, Badge, Box, CssBaseline, Icon, IconButton, InputBase, ThemeProvider, Toolbar, Tooltip, Typography, createTheme } from '@mui/material'
import { errorAtom, favoriteAtom, moviesAtom, searchAtom, themeAtom } from './store'
import { useRedirect } from './util'
import { Loader } from './component/Loader'
import './App.scss'

const FavoriteList = lazy(() => import('./component/FavoriteList'))
const MovieDetail = lazy(() => import('./component/MovieDetail'))
const MovieList = lazy(() => import('./component/MovieList'))

function PaletteModeButton() {
    const [mode, toggleMode] = useAtom(themeAtom)
    const toggleModeHandler = useCallback(() => toggleMode(), [toggleMode])

    return <Tooltip title={`change to ${mode === 'dark' ? 'light' : 'dark'} theme mode`}>
        <IconButton onClick={toggleModeHandler}>
            {mode === 'dark' ? <DarkMode /> : <LightMode />}
        </IconButton>
    </Tooltip>
}

function SearchBox() {
    const [initialSearch, setSearch] = useAtom(searchAtom)
    const { refetch } = useAtomValue(moviesAtom)
    const redirect = useRedirect()
    const onSearch = useCallback(({ key, target }: KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement }) => {
        if (key === 'Enter') {
            setSearch(target.value)
            refetch()
            redirect('/')
        }
    }, [redirect, refetch, setSearch])

    return <Box className="search-input">
        <Icon><Search /></Icon>
        <InputBase autoFocus onKeyDown={onSearch} placeholder="Search…" defaultValue={initialSearch} inputProps={{ 'aria-label': 'search' }} />
    </Box>
}

function FavoriteLink() {
    const favoriteCount = useAtomValue(favoriteAtom).length
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
    const error = useAtomValue(errorAtom)

    if (typeof error !== 'string') {
        return <></>
    }

    return <Alert severity="error">{error}</Alert>
}

export function App() {
    const mode = useAtomValue(themeAtom)
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
