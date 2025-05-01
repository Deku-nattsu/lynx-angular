import type { RsbuildPluginAPI } from '@lynx-js/rspeedy';
import type { NormalizedOptions } from "./options.js";
import path from 'path';
import { fileURLToPath } from 'url';

export function applyAngularConfig(
    api: RsbuildPluginAPI,
    buildOptions: NormalizedOptions
  ): void {
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    
    api.modifyRsbuildConfig((config) => {
      // output
      config.output = config.output ?? {};
      config.output.distPath ??= {};
      if (buildOptions.outputPath) {
        config.output.distPath.root = buildOptions.outputPath;
      }
      config.output.cleanDistPath = true;
      // const hashFormat = getOutputHashFormat(OutputHashing.None, 8);
      // config.output.filename ??= {};
      // config.output.filename.js = `[name]${hashFormat.chunk}.js`;
      // config.output.filename.css = `[name]${hashFormat.file}.css`;
      // config.output.distPath.js = "";
      // config.output.distPath.jsAsync = "";
      // config.output.distPath.css = "";
      // config.html ??= {};
      // config.html.template ??= buildOptions.index;
      config.source ??= {};
      // if (!config.source.entry.index) {
      //   const indexPath = relativePrefix(buildOptions.browser);
      //   config.source.entry.index = indexPath;
      // }
      if (typeof config.source.preEntry === "string") {
        config.source.preEntry = [config.source.preEntry];
      } else {
        config.source.preEntry ??= [];
      }
      config.source.preEntry.push(path.resolve(__dirname, './polyfills'));
      const polyfills = buildOptions.polyfills;
      if (polyfills) {
        config.source.preEntry.push(...polyfills);
      }
      config.source.preEntry.push(...buildOptions.styles);
      config.source.tsconfigPath = buildOptions.tsconfig;
      const isProd =
        process.env['NODE_ENV'] === "production" || config.mode === "production";
      if (isProd) {
        config.source.define ??= {};
        config.source.define['ngDevMode'] = false;
      }
    });
  }