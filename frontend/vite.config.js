/**
 * What is this?
 * 
 * These are the configurations of Vite, an open source tool that speeds up
 * the creation of the frontend of the application.
 *  
 **/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@welldone-software/why-did-you-render',
    }),
    VitePWA({ registerType: 'autoUpdate' }),
  ],
  resolve: {
    alias: {
      'react-redux': 'react-redux/dist/react-redux.js',
    },
  },
})