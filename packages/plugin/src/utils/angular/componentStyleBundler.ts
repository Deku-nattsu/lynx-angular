import { ComponentStylesheetBundler } from "@angular/build/src/tools/esbuild/angular/component-stylesheets";
import type { NormalizedOptions } from "./options.js";
import { getSupportedBrowsers, transformSupportedBrowsersToTargets } from "@angular/build/private";

export function createComponentStyleBundler(
    options: NormalizedOptions,
  ): ComponentStylesheetBundler {
    const {
      workspaceRoot,
      optimizationOptions,
      sourcemapOptions,
      outputNames,
    //   externalDependencies,
    //   preserveSymlinks,
    //   stylePreprocessorOptions,
      inlineStyleLanguage = 'css',
      cacheOptions,
    //   tailwindConfiguration,
    //   postcssConfiguration,
    //   publicPath,
    } = options;
    //const incremental = !!options.watch;

    return new ComponentStylesheetBundler(
      {
        workspaceRoot,
        inlineFonts: !!optimizationOptions.fonts.inline,
        optimization: !!optimizationOptions.styles.minify,
        sourcemap:
          // Hidden component stylesheet sourcemaps are inaccessible which is effectively
          // the same as being disabled. Disabling has the advantage of avoiding the overhead
          // of sourcemap processing.
          sourcemapOptions.styles && !sourcemapOptions.hidden ? 'linked' : false,
        outputNames,
        // includePaths: stylePreprocessorOptions?.includePaths,
        // string[] | undefined' is not assignable to type '(Version | DeprecationOrId)[] | undefined'.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // sass: stylePreprocessorOptions?.sass as any,
        // externalDependencies,
        target: transformSupportedBrowsersToTargets(
            getSupportedBrowsers(workspaceRoot, {
              warn: (message) => console.warn(message),
            })
        ),
        // preserveSymlinks,
        // tailwindConfiguration,
        // postcssConfiguration,
        cacheOptions,
        // publicPath,
      },
      inlineStyleLanguage,
      false,
    );
  }
