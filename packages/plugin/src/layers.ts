import type { Rspack } from "@lynx-js/rspeedy";
import type { RsbuildPluginAPI} from '@lynx-js/rspeedy'
export const LAYERS = {
    BACKGROUND: "background",
    MAIN_THREAD: "main"
}

export function applyLayers(api: RsbuildPluginAPI): void{
    api.modifyBundlerChain((chain) => {
        const experiments = chain.get(
          "experiments"
        ) as Rspack.Configuration["experiments"];

        chain.experiments({
          ...experiments,
          layers: true,
        });

        chain.module
        .rule('typescript')
        .oneOf(LAYERS.BACKGROUND)
        .layer(LAYERS.BACKGROUND)
        .test(/\.[cm]?[jt]sx?$/)
        .use('builtin:swc-loader')
        .loader('builtin:swc-loader')
        .options({
          jsc: {
            target: 'es2015',
            parser: {
              syntax: 'typescript',
            }
          }
        }).end();

      // Configure main layer
      chain.module
        .rule('typescript')
        .oneOf(LAYERS.MAIN_THREAD)
        .layer(LAYERS.MAIN_THREAD)
        .test(/\.[cm]?[jt]sx?$/)
        .use('builtin:swc-loader')
        .loader('builtin:swc-loader')
        .options({
          jsc: {
            target: 'es2019',
            parser: {
              syntax: 'typescript',
            }
          }
        }).end()
        // // https://lynxjs.org/guide/scripting-runtime/index.html#javascript-syntax-transformers
        // setTarget(LAYERS.MAIN_THREAD, 'es2015');
        // setTarget(LAYERS.BACKGROUND, 'es2015');

        // // clear the default
        // globalRule.uses.clear();
        // function setTarget(layer: string, target: string){
        //     const layerRule = globalRule.oneOf(layer);
        //     layerRule.issuerLayer(layer)
        //     .uses.merge(uses)
        //     .end()
        //     .when(!!uses[util.CHAIN_ID.USE.SWC], rule => {
        //         rule.uses.delete(util.CHAIN_ID.USE.SWC)
        //         const swcLoaderRule = uses[util.CHAIN_ID.USE.SWC]!.entries() as Rspack.RuleSetRule;
        //         const swcLoaderOptions = swcLoaderRule
        //         .options as Rspack.SwcLoaderOptions;
        //         rule.use(util.CHAIN_ID.USE.SWC)
        //         .merge(swcLoaderRule)
        //         .options({
        //           ...swcLoaderOptions,
        //           jsc: {
        //             ...swcLoaderOptions.jsc,
        //             target,
        //           },
        //           env: undefined
        //         })
        //     })
        //     .end();
        // }
      });
}



