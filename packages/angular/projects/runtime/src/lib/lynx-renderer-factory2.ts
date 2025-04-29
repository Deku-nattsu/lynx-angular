import { inject, Injectable, Renderer2, RendererFactory2, type RendererType2 } from "@angular/core";
import { LynxRenderer } from "./renderer";
import { type LynxDocumentBase } from "./lynx-document";
import { LYNX_DOCUMENT } from "./token";

@Injectable()
export class LynxRendererFactory2 implements RendererFactory2{
  lynxDocument: LynxDocumentBase = inject(LYNX_DOCUMENT);
  createRenderer(_hostElement: any, _type: RendererType2 | null): Renderer2 {
    return new LynxRenderer(this.lynxDocument);
  }
  begin?(): void {

  }
  end?(): void {
    if(__MAIN_THREAD__){
      __FlushElementTree();
    }
  }
}
