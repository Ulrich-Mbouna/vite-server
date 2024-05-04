import {defineConfig, loadEnv} from "vite";
import {resolve} from "path";
import {VitePluginNode} from "vite-plugin-node";
import Unimport from "unimport/unplugin";

export default defineConfig(({command,mode}) => {
    const env = loadEnv(mode, process.cwd(), '')

    return {
        server:{
            port: env.VITE_APP_PORT
        },
        resolve:{
            alias: {
                "@": resolve(__dirname, './src')
            }
        },
        plugins: [
            ...VitePluginNode({
                adapter: 'express',
                appPath: './src/app.ts',
            }),
            Unimport.vite({
                dirs: [
                    './src/composables/**',
                    './src/utils/**'
                ]
            })
        ]
    }
})
