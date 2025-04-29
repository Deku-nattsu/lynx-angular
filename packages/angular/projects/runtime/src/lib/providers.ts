import { type EnvironmentProviders, makeEnvironmentProviders, RendererFactory2 } from "@angular/core";
import { LynxBackgroundDocument, LynxDocument } from "./lynx-document";
import { LynxRendererFactory2 } from "./lynx-renderer-factory2";
import { LYNX_DOCUMENT } from "./token";

export const provideLynxRenderer = (): EnvironmentProviders =>{
  return makeEnvironmentProviders([
    {
      provide: LYNX_DOCUMENT,
      useFactory: ()=> {
        if(__MAIN_THREAD__){
          return new LynxDocument();
        }
        return new LynxBackgroundDocument();
      }
    },
    LynxRendererFactory2,
    {
      provide: RendererFactory2,
      useExisting: LynxRendererFactory2
    }
  ])
}


