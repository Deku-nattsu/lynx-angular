import { defineConfig } from '@lynx-js/rspeedy';
import { pluginAngularLynx } from 'plugin';
import { pluginQRCode } from "@lynx-js/qrcode-rsbuild-plugin";
export default defineConfig({
    source: {
        entry: './src/main.ts'
    },
    plugins: [
        pluginQRCode({
            schema(url) {
              // We use `?fullscreen=true` to open the page in LynxExplorer in full screen mode
              return `${url}?fullscreen=true`
            },
        }),
        pluginAngularLynx(),
    ]
})