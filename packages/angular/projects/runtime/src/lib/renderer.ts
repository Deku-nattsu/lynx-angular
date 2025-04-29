import type { ListenerOptions, Renderer2, RendererStyleFlags2 } from "@angular/core";
import type { LynxDocumentBase } from "./lynx-document";
import type { BaseLynxElement } from "./lynx-element";


export class LynxRenderer implements Renderer2{
  constructor(private document: LynxDocumentBase){}

  get data(): { [key: string]: any; } {
    return {};
  }
  destroy(): void {
  }
  createElement(name: string, _namespace?: string | null): BaseLynxElement {
    return this.document.createElement(name);
  }
  createComment(_value: string): BaseLynxElement {
    return this.document.createComment()
  }
  createText(value: string): BaseLynxElement {
    return this.document.createText(value);
  }
  destroyNode: ((node: unknown) => void) | null = null;

  appendChild(parent: BaseLynxElement, newChild: BaseLynxElement): void {
    parent.appendChild(newChild);
  }
  insertBefore(parent: BaseLynxElement, newChild: BaseLynxElement, refChild: BaseLynxElement, isMove?: boolean): void {
    parent.insertBefore(newChild, refChild);
  }
  removeChild(_parent: BaseLynxElement, oldChild: BaseLynxElement, _isHostElement?: boolean): void {
    oldChild.remove();
  }
  selectRootElement(): BaseLynxElement {
    return this.document.createRootElement();
  }
  parentNode(node: BaseLynxElement): BaseLynxElement | null {
    return node.parentNode();
  }
  nextSibling(node: BaseLynxElement): BaseLynxElement | null {
    return node.nextSibling();
  }
  setAttribute(el: BaseLynxElement, name: string, value: string, _namespace?: string | null): void {
    el.setAttribute(name, value);
  }
  removeAttribute(el: BaseLynxElement, name: string, _namespace?: string | null): void {
    el.removeAttribute(name);
  }
  addClass(el: BaseLynxElement, name: string): void {
    el.addClass(name);
  }
  removeClass(el: BaseLynxElement, name: string): void {
    el.removeClass(name);
  }
  setStyle(el: BaseLynxElement, style: string, value: any, _flags?: RendererStyleFlags2): void {
    el.setStyle(style, value);
  }
  removeStyle(el: BaseLynxElement, style: string, _flags?: RendererStyleFlags2): void {
    el.removeStyle(style);
  }
  setProperty(el: BaseLynxElement, name: string, value: any): void {
    el.setProperty(name, value);
  }
  setValue(node: BaseLynxElement, value: string): void {
    node.setAttribute("text", value);
  }
  listen(target: BaseLynxElement, eventName: string, callback: (event: boolean) => boolean | void, _options?: ListenerOptions): () => void {
    return target.addEventListener(eventName, callback);
  }

}
