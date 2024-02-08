import * as esbuild from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

await esbuild.build({
    bundle: true,
    color: true,
    drop: ['console'],
    entryPoints: ['src/index.tsx'],
    minify: true,
    outdir: 'public/asset',
    define: {
        'process.env.NODE_ENV': '"production"',
        'process.env.API_KEY': '"23c661e5"',
    },
    loader: {
        '.woff': 'file',
        '.woff2': 'file',
    },
    plugins: [
        sassPlugin({ minify: true }),
    ],
})
