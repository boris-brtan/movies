import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { DevTools } from 'jotai-devtools'
import 'jotai-devtools/styles.css'

let app = document.getElementById('app')
if (!app) {
    app = document.createElement('div')
    app.id = 'app'
    document.body.append(app)
}

createRoot(app).render(<StrictMode>
    <DevTools />
    <App />
</StrictMode>)

process.env.NODE_ENV === 'dev' && new EventSource('/esbuild').addEventListener('change', () => location.reload())
