// import type {
//   NormalizedEnvironmentConfig,
// } from "@rsbuild/core";
import type {ExposedAPI, RsbuildPluginAPI, Rspack} from '@lynx-js/rspeedy'
import type { UndefinedOnPartialDeep } from "type-fest";
import { LAYERS } from "./layers.js";
import {
  CSSPlugins,
  LynxEncodePlugin,
  LynxTemplatePlugin,
} from "@lynx-js/template-webpack-plugin";

import path from "path";
import type { PluginAngularLynxOptions } from "./utils/options.js";
import { RuntimeWrapperWebpackPlugin } from '@lynx-js/runtime-wrapper-webpack-plugin'
import { AngularWebpackPlugin } from "./AngularWebpackPlugin.js";

// const DEFAULT_DIST_PATH_INTERMEDIATE = ".rspeedy";
// const DEFAULT_FILENAME_HASH = ".[contenthash:8]";
// const EMPTY_HASH = "";
const PLUGIN_NAME_TEMPLATE = "lynx:template";
const PLUGIN_NAME_RUNTIME_WRAPPER = 'lynx:runtime-wrapper'
const PLUGIN_NAME_ANGULAR = 'lynx:angular'

export function applyEntry(api: RsbuildPluginAPI, options: Required<PluginAngularLynxOptions>): void {
  const {
    customCSSInheritanceList,
    debugInfoOutside,
    defaultDisplayLinear,
    enableAccessibilityElement,
    enableICU,
    enableCSSInheritance,
    enableCSSInvalidation,
    enableCSSSelector,
    enableNewGesture,
    enableParallelElement,
    enableRemoveCSSScope,
    pipelineSchedulerConfig,
    removeDescendantSelectorScope,
    targetSdkVersion,

    experimental_isLazyBundle,
  } = options;

  const { config } = api.useExposed<ExposedAPI>(
    Symbol.for('rspeedy.api'),
  )!

  api.modifyBundlerChain((chain, {environment, isDev}) => {
    const isLynx = environment.name === 'lynx'
    const isWeb = environment.name === 'web'

    //split entries
    const entries = chain.entryPoints.entries() ?? {};
    chain.entryPoints.clear();
    let mainThreadChunks: string[] = [];
    let backgroundChunks: string[] = [];
    Object.entries(entries).forEach(([entryName, entryPoint]) => {
      const { imports } = getChunks(entryName, entryPoint.values());

      const templateFilename = (
        typeof config.output?.filename === 'object'
          ? config.output.filename.bundle ?? config.output.filename.template
          : config.output?.filename
      ) ?? '[name].[platform].bundle';

      const mainThreadEntry = `${entryName}__main-thread`;
      const mainThreadName = path.posix.join(`${entryName}/main-thread.js`);
      const backgroundEntry = entryName
      const backgroundThreadName = path.posix.join(
        `${entryName}/background-thread.js`
      );

      mainThreadChunks.push(mainThreadName);
      backgroundChunks.push(backgroundThreadName);
      chain
        .entry(mainThreadEntry)
        .add({
          layer: LAYERS.MAIN_THREAD,
          import: imports,
          filename: mainThreadName,
        })
        .end();
        
      chain
        .entry(backgroundEntry)
        .add({
          layer: LAYERS.BACKGROUND,
          import: imports,
          filename: backgroundThreadName,
        })
        .when(isDev && !isWeb, entry => {
          entry
            // This is aliased in `@lynx-js/rspeedy`
            .add({
              layer: LAYERS.BACKGROUND,
              import: '@rspack/core/hot/dev-server',
            })
            .add({
              layer: LAYERS.BACKGROUND,
              import: '@lynx-js/webpack-dev-transport/client',
            })
        })
        .end();
      // apply lynx plugins
      chain
        .plugin(`${PLUGIN_NAME_TEMPLATE}-${entryName}`)
        .use(LynxTemplatePlugin, [
          {
            filename: templateFilename.replaceAll('[name]', entryName).replaceAll(
              '[platform]',
              environment.name,
            ),
            chunks: [mainThreadEntry, backgroundEntry],
            cssPlugins: [CSSPlugins.parserPlugins.removeFunctionWhiteSpace()],
            customCSSInheritanceList,
            debugInfoOutside,
            defaultDisplayLinear,
            enableAccessibilityElement,
            enableICU,
            enableCSSInheritance,
            enableCSSInvalidation,
            enableCSSSelector,
            enableNewGesture,
            enableParallelElement,
            enableRemoveCSSScope,
            pipelineSchedulerConfig,
            removeDescendantSelectorScope,
            targetSdkVersion,
            enableA11y: true,
            experimental_isLazyBundle,
          },
        ]).end();
    });
    if (isLynx) {
      chain
        .plugin(PLUGIN_NAME_RUNTIME_WRAPPER)
        .use(RuntimeWrapperWebpackPlugin, [{
          injectVars(vars) {
            return vars.map(name => {
              if (name === 'Component') {
                return '__Component'
              }
              return name
            })
          },
          targetSdkVersion,
          // Inject runtime wrapper for all `.js` but not `main-thread.js` and `main-thread.[hash].js`.
          test: /^(?!.*main-thread(?:\.[A-Fa-f0-9]*)?\.js$).*\.js$/,
        }])
        .end()
        chain
        .plugin(`${LynxEncodePlugin.name}`)
        .use(LynxEncodePlugin, [{}])
        .end();
    }
    chain
    .plugin(PLUGIN_NAME_ANGULAR)
    .after(PLUGIN_NAME_TEMPLATE)
    .use(AngularWebpackPlugin, [{
      mainThreadChunks,
      backgroundChunks
    }])
  });
}

// This is copied from https://github.com/web-infra-dev/rsbuild/blob/037da7b9d92e20c7136c8b2efa21eef539fa2f88/packages/core/src/plugins/html.ts#L168
function getChunks(
  entryName: string,
  entryValue: (
    | string
    | string[]
    | UndefinedOnPartialDeep<Rspack.EntryDescription>
  )[]
): { chunks: string[]; imports: string[] } {
  const chunks = [entryName];
  const imports: string[] = [];

  for (const item of entryValue) {
    if (typeof item === "string") {
      imports.push(item);
      continue;
    }

    if (Array.isArray(item)) {
      imports.push(...imports);
      continue;
    }

    const { dependOn } = item;

    if (Array.isArray(item.import)) {
      imports.push(...item.import);
    } else {
      imports.push(item.import);
    }

    if (!dependOn) {
      continue;
    }

    if (typeof dependOn === "string") {
      chunks.unshift(dependOn);
    } else {
      chunks.unshift(...dependOn);
    }
  }

  return { chunks, imports };
}

// function getBackgroundFilename(
//   entryName: string,
//   config: NormalizedEnvironmentConfig,
//   isProd: boolean
// ): string {
//   const { filename } = config.output;

//   if (typeof filename.js === "string") {
//     return filename.js
//       .replaceAll("[name]", entryName)
//       .replaceAll(".js", "/background.js");
//   } else {
//     return `${entryName}/background${getHash(config, isProd)}.js`;
//   }
// }

// function getHash(config: NormalizedEnvironmentConfig, isProd: boolean): string {
//   if (typeof config.output?.filenameHash === "string") {
//     return config.output.filenameHash
//       ? `.[${config.output.filenameHash}]`
//       : EMPTY_HASH;
//   } else if (config.output?.filenameHash === false) {
//     return EMPTY_HASH;
//   } else if (isProd) {
//     return DEFAULT_FILENAME_HASH;
//   } else {
//     return EMPTY_HASH;
//   }
// }
