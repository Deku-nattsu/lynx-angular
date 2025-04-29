import type { RsbuildPluginAPI } from '@lynx-js/rspeedy';
import { getWorkspace } from './utils/angular/readWorkspace.js';
import { readBuildOptions } from './utils/angular/options.js';
import { JavaScriptTransformer } from '@angular/build/src/tools/esbuild/javascript-transformer';
import { maxWorkers, useTypeChecking } from './utils/angular/env.js';
import {
  createAngularCompilation,
  DiagnosticModes,
} from '@angular/build/src/tools/angular/compilation';
import path from 'path';
import { applyAngularConfig } from './utils/angular/angular-config.js';

export async function applyAngularRules(api: RsbuildPluginAPI): Promise<void> {
  const workspace = await getWorkspace();
  const project = [...workspace.projects.values()][0]!;
  const buildOptions = (await readBuildOptions(project))!;
  applyAngularConfig(api, buildOptions);

  const sourcemap = !!(
    !!buildOptions.sourcemapOptions.scripts &&
    (buildOptions.sourcemapOptions.hidden ? 'external' : true)
  );
  const thirdPartySourcemaps = buildOptions.sourcemapOptions.vendor;
  const advancedOptimizations = buildOptions.advancedOptimizations;
  const javascriptTransformer = new JavaScriptTransformer(
    {
      sourcemap,
      thirdPartySourcemaps,
      advancedOptimizations,
      jit: false,
    },
    maxWorkers,
    undefined
  );
  const tsconfig = buildOptions.tsconfig;
  const compilation = await createAngularCompilation(false, true);
  const typeScriptFileCache = new Map<string, string | Uint8Array>();
  // Determines if TypeScript should process JavaScript files based on tsconfig `allowJs` option
  // let shouldTsIgnoreJs = true;
  // Determines if transpilation should be handle by TypeScript or esbuild
  // let useTypeScriptTranspilation = true;
  const componentStylesCache = new Map<string, {
    imports: string[];
    inlineStyles: string[];
  }>();
  api.onBeforeEnvironmentCompile(async ()=> {
        console.log("onBeforeEnvironmentCompile")
        // Initialize the Angular compilation for the current build.
        // In watch mode, previous build state will be reused.
        // let referencedFiles;
        // let externalStylesheets;
        try {
          await compilation.initialize(
            tsconfig,
            {
              processWebWorker: (workerFile, _containingFile) => {
                return workerFile;
              },
              async transformStylesheet(
                data,
                containingFile,
                stylesheetFile,
                _order,
                _className
              ) {
                console.log("containingFile", containingFile)
                let componentStyles = componentStylesCache.get(containingFile);
                if (!componentStyles) {
                  componentStyles = {
                    imports: [],
                    inlineStyles: [],
                  };
                  componentStylesCache.set(containingFile, componentStyles);
                }
                if(stylesheetFile){
                  componentStyles.imports.push(stylesheetFile);
                } else {
                  componentStyles.inlineStyles.push(data);
                }
                return "";
              },
            },
            (compilerOptions) => {
              return {
                ...compilerOptions,
                noEmitOnError: false,
                inlineSources: !!sourcemap,
                inlineSourceMap: !!sourcemap,
                sourceMap: undefined,
                mapRoot: undefined,
                sourceRoot: undefined,
                preserveSymlinks: false,
                // externalRuntimeStyles: pluginOptions.externalRuntimeStyles,
                // _enableHmr: !!pluginOptions.templateUpdates,
                // supportTestBed: !!pluginOptions.includeTestMetadata,
              };
            }
          );
          // shouldTsIgnoreJs = !initializationResult.compilerOptions.allowJs;
          // // Isolated modules option ensures safe non-TypeScript transpilation.
          // // Typescript printing support for sourcemaps is not yet integrated.
          // useTypeScriptTranspilation =
          //   !initializationResult.compilerOptions.isolatedModules ||
          //   !!initializationResult.compilerOptions.sourceMap ||
          //   !!initializationResult.compilerOptions.inlineSourceMap;
          // referencedFiles = initializationResult.referencedFiles;
          // externalStylesheets = initializationResult.externalStylesheets;
        } catch (error) {}
        try {
          for (const {
            filename,
            contents,
          } of await compilation.emitAffectedFiles()) {
            typeScriptFileCache.set(path.normalize(filename), contents);
          }
        } catch (error) {}
        const diagnostics = await compilation.diagnoseFiles(
          useTypeChecking
            ? DiagnosticModes.All
            : DiagnosticModes.All & ~DiagnosticModes.Semantic
        );
        console.log(diagnostics)
        await compilation.close?.();
  })

  api.transform(
    {
      test: /\.[cm]?[jt]sx?$/,
    },
    async (context) => {
      const isJs = /\.[cm]?js$/.test(context.resourcePath);
      if (isJs) {
        let contents = await javascriptTransformer.transformData(
          context.resourcePath,
          context.code,
          false,
          false
        )
        return {
          code: Buffer.from(contents).toString(),
        }
      }
      const content = typeScriptFileCache.get(context.resourcePath)!;
      let code: string;
      if (typeof content === "string") {
        code = content;
      } else {
        code = Buffer.from(content).toString();
      }
      const componentStyles = componentStylesCache.get(context.resourcePath);
      if(componentStyles) {
        const {imports} = componentStyles;
        let importsString = '';
        for(let i = 0; i < imports.length; ++i){
          let relativeImport = path.relative(path.dirname(context.resourcePath), imports[i]!)
          if(!relativeImport.startsWith('.')){
            relativeImport = './' + relativeImport;
          }
          importsString += 'import "' + relativeImport + '";';
        }
        code = importsString + code;
      }
      return {
        code,
      };
    }
  );
}
