import assert from "assert";
import path from "path";
import { access, constants } from 'node:fs/promises';
import { workspaces } from "@angular-devkit/core";
import { normalizeCacheOptions, type NormalizedCachedOptions } from "./nomalize-cache.js";
import { OutputHashing } from "@angular-devkit/build-angular";
import type { TargetDefinition } from "@angular-devkit/core/src/workspace/definitions";

export function normalizeSourceMaps(sourceMap: any): any {
  const scripts = typeof sourceMap === "object" ? sourceMap.scripts : sourceMap;
  const styles = typeof sourceMap === "object" ? sourceMap.styles : sourceMap;
  const hidden = (typeof sourceMap === "object" && sourceMap.hidden) || false;
  const vendor = (typeof sourceMap === "object" && sourceMap.vendor) || false;

  return {
    vendor,
    hidden,
    scripts,
    styles,
  };
}

export function normalizeOptimization(
  optimization: boolean | Record<string, any> | undefined = true
): any {
  if (typeof optimization === "object") {
    const styleOptimization = !!optimization['styles'];

    return {
      scripts: !!optimization['scripts'],
      styles:
        typeof optimization['styles'] === "object"
          ? optimization['styles']
          : {
              minify: styleOptimization,
              removeSpecialComments: styleOptimization,
              inlineCritical: styleOptimization,
            },
      fonts:
        typeof optimization['fonts'] === "object"
          ? optimization['fonts']
          : {
              inline: !!optimization['fonts'],
            },
    };
  }

  return {
    scripts: optimization,
    styles: {
      minify: optimization,
      inlineCritical: optimization,
      removeSpecialComments: optimization,
    },
    fonts: {
      inline: optimization,
    },
  };
}

export type NormalizedOptions = {
  tsconfig: string;
  optimizationOptions: {
    scripts: boolean;
    styles: any;
    fonts: any;
  };
  sourcemapOptions: {
    vendor: any;
    hidden: any;
    scripts: any;
    styles: any;
  };
  fileReplacements: Record<string, string> | undefined;
  polyfills?: string[];
  index: string;
  browser: string;
  advancedOptimizations: boolean;
  outputPath: string | undefined;
  workspaceRoot: string;
  outputNames: {
    bundles: string;
    media: string;
  }
  cacheOptions: NormalizedCachedOptions;
  inlineStyleLanguage: string | undefined;
  outputHashing: OutputHashing;
  styles: string[];
};
type Replacement = {
    with: string,
    replace: string
}

export function readTarget(project: workspaces.ProjectDefinition, target = 'build'): TargetDefinition | undefined{
  return project.targets.get(target);
}
export async function readBuildOptions(project: workspaces.ProjectDefinition, configurationName?: string): Promise<NormalizedOptions | null> {
  const workspaceRoot = process.cwd();
  const target = readTarget(project);
  if(!target){
    throw new Error("couldn't find target")
  }
  configurationName??= target.defaultConfiguration;
  const buildOptions = target?.options;
  // TODO: throw error to the user
  if (!buildOptions) return null;
  // appending the configuration to build options
  const configurations = target.configurations;
  if(configurations){
    for(const name in configurations){
      if(name === configurationName){
        Object.assign(buildOptions, {
          ...configurations[name]
        });
        break;
      }
    }
  }
  assert(!!buildOptions, "build options is undefined");
  // TODO: support jit
  const aot = true;
  const tsconfig = buildOptions["tsConfig"] as string;
  const optimizationOptions = normalizeOptimization(
    buildOptions["optimization"] as Record<string, any>
  );
  const sourcemapOptions = normalizeSourceMaps(
    buildOptions["sourceMap"] ?? false
  );
  const browser = buildOptions["browser"] as string;
  const index = buildOptions["index"] as string;
  let polyfills = buildOptions["polyfills"] as string | string[] | undefined;
  polyfills =
    polyfills === undefined || Array.isArray(polyfills)
      ? polyfills
      : [polyfills];
  let fileReplacements: Record<string, string> | undefined;
  const buildOptionsFileReplacements = buildOptions["fileReplacements"] as Replacement[];
  if (buildOptionsFileReplacements) {
    for (const replacement of buildOptionsFileReplacements) {
      const fileReplaceWith = path.join(workspaceRoot, replacement.with);

      try {
        await access(fileReplaceWith, constants.F_OK);
      } catch {
        throw new Error(
          `The ${fileReplaceWith} path in file replacements does not exist.`
        );
      }

      fileReplacements ??= {};
      fileReplacements[path.join(workspaceRoot, replacement.replace)] =
        fileReplaceWith;
    }
  }
  let outputHashing = buildOptions['outputHashing'] as OutputHashing;
  let media = 'media';
  const outputNames = {
    bundles:
      outputHashing === 'all' || outputHashing === 'bundles'
        ? '[name]-[hash]'
        : '[name]',
    media:
      media +
      (outputHashing === 'all' || outputHashing === 'media'
        ? '/[name]-[hash]'
        : '/[name]'),
  };
  const advancedOptimizations = !!aot && optimizationOptions.scripts;
  const cacheOptions = normalizeCacheOptions(buildOptions['projectMetadata'], workspaceRoot);
  const inlineStyleLanguage = buildOptions['inlineStyleLanguage'] as string | undefined;
  const normalizedOptions: NormalizedOptions = {
    optimizationOptions,
    advancedOptimizations,
    index,
    browser,
    fileReplacements,
    sourcemapOptions,
    tsconfig,
    polyfills: polyfills ?? [],
    outputPath: buildOptions["outputPath"] as string | undefined,
    workspaceRoot,
    outputNames,
    cacheOptions,
    inlineStyleLanguage,
    outputHashing,
    styles: buildOptions["styles"] as string[] ?? []
  };
  return normalizedOptions;
}
