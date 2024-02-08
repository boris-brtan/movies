import React, { useMemo } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DarkMode, LightMode, Search } from '@mui/icons-material'
import { AppBar, Box, CssBaseline, Icon, IconButton, InputBase, ThemeProvider, Toolbar, Tooltip, Typography, createTheme } from '@mui/material'
import { useThemeStore } from './store/theme'
import './App.scss'

function PaletteModeButton() {
    const [mode, toggleMode] = useThemeStore((state) => [state.mode, () => state.toggleMode()])

    return <Tooltip title={`change to ${mode === 'dark' ? 'light' : 'dark'} theme mode`}>
        <IconButton onClick={toggleMode}>
            {mode === 'dark' ? <DarkMode /> : <LightMode />}
        </IconButton>
    </Tooltip>
}

export function App() {
    const mode = useThemeStore((state) => state.mode)
    const theme = useMemo(() => createTheme({ palette: { mode } }), [mode])

    return <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        <AppBar position="sticky">
            <Toolbar >
                <Typography
                    variant="h6"
                    noWrap
                    component="h1"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                >
                    Project
                </Typography>
                <Box className="search-input">
                    <Icon><Search /></Icon>
                    <InputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
                </Box>
                <PaletteModeButton />
            </Toolbar>
        </AppBar>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<>Empty content</>} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>
}
