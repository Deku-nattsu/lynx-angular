import type { RsbuildPlugin } from '@lynx-js/rspeedy'
import { applyLayers } from "./layers.js";
import { applyEntry } from "./entry.js";
import { normalizeOptions, type PluginAngularLynxOptions } from "./utils/options.js";
import { applyAngularRules } from "./angular.js";
import { applySplitChunksRule } from './splitChunks.js';
import { applyCSS } from './css.js';
import { applyGenerator } from './generator.js';

export function pluginAngularLynx(options?: PluginAngularLynxOptions): RsbuildPlugin {
  return {
    name: "lynx:angular",
    pre: ['lynx:rsbuild:plugin-api'],
    setup: (api) => {
      const normalizedOptions = normalizeOptions(options);
      applyCSS(api, normalizedOptions);
      applyEntry(api, normalizedOptions);
      applyLayers(api);
      applyAngularRules(api);
      applyGenerator(api);
      applySplitChunksRule(api);
    },
  };
}
