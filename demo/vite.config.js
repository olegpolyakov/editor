import path from 'node:path';

import react from '@vitejs/plugin-react';
import { NodePackageImporter } from 'sass';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ command }) => ({
    base: command === 'build' ? '/kantanui/' : '/',
    root: path.resolve(__dirname, 'src'),
    publicDir: path.resolve(__dirname, 'public'),
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
        sourcemap: true
    },
    css: {
        modules: {
            scopeBehaviour: 'local',
            localsConvention: 'dashes',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
        },
        preprocessorOptions: {
            scss: {
                importers: [new NodePackageImporter()],
                loadPaths: [path.resolve(__dirname, '../src/styles')]
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    plugins: [
        react(),
        svgr()
    ],
    server: {
        open: true
    }
}));