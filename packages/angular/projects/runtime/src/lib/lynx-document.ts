import type { ElementRef } from "./types/lynx";
import { BaseLynxElement, LynxBackgroundElement, LynxElement } from "./lynx-element"

export class LynxDocument{
  page!: LynxElement;
  private pageId = 0;

  constructor(){
    console.log("main thread lynx document");
  }
  createRootElement(): LynxElement{
    const pageElement = __CreatePage("0", 0);
    this.page = new LynxElement(pageElement);
    this.pageId = __GetElementUniqueID(pageElement);
    return this.page;
  }
  createElement(tag: string, value?: string): LynxElement{
    let element: ElementRef;
    switch(tag){
      case 'x-view':{
        element = __CreateView(this.pageId);
        break;
      }
      case 'x-image': {
        element = __CreateImage(this.pageId);
        break;
      }
      case 'x-text': {
        element = __CreateText(this.pageId);
        break;
      }
      case 'x-raw-text': {
        element = __CreateRawText(value ?? '');
        break;
      }
      case 'x-scroll-view': {
        element = __CreateScrollView(this.pageId);
        break;
      }
      default: {
        console.log("unknown element tag ", tag);
      }
    }
    return new LynxElement(element!);
  }
  createText(value: string): LynxElement{
    const text = __CreateRawText(value);
    const lynxElement = new LynxElement(text);
    return lynxElement
  }
  createComment(): LynxElement{
    // TODO: this i think should be raw text
    const nonElement = __CreateNonElement(this.pageId);
    return new LynxElement(nonElement);
  }
  appendChild(newChild: LynxElement): void{
    this.page.appendChild(newChild);
  }
}

export class LynxBackgroundDocument implements LynxDocumentBase{
  _page: LynxBackgroundElement | null = null;

  constructor(){
    console.log("background thread lynx document");
  }
  createRootElement(): LynxBackgroundElement {
    const page = new LynxBackgroundElement();
    this._page = page;
    return this._page;
  }
  createElement(tag: string, value?: string): LynxBackgroundElement {
    return new LynxBackgroundElement();
  }
  createText(value: string): LynxBackgroundElement {
    return new LynxBackgroundElement();
  }
  createComment(): LynxBackgroundElement {
    return new LynxBackgroundElement();
  }
  appendChild(newChild: LynxBackgroundElement): void {
    this._page?.appendChild(newChild);
  }
}

export interface LynxDocumentBase{
  createRootElement(): BaseLynxElement;
  createElement(tag: string, value?: string): BaseLynxElement;
  createText(value: string): BaseLynxElement;
  createComment(): BaseLynxElement;
  appendChild(newChild: BaseLynxElement): void;
}
