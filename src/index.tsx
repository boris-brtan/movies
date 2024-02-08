import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

let app = document.getElementById('app')
if (!app) {
    document.body.append(app = document.createElement('div'))
}

createRoot(app).render(<StrictMode><App /></StrictMode>)

process.env.NODE_ENV === 'dev' && new EventSource('/esbuild').addEventListener('change', () => location.reload())
