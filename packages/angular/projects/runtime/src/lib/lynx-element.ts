import { ElementRef } from "./types/lynx";

export interface BaseLynxElement{
  setProperty(name: string, value: any): void;
  setAttribute(name: string, value: any): void;
  getAttribute(name: string): string | null;
  removeAttribute(name: string): void;
  setStyle(key: string, value: unknown): void;
  removeStyle(key: string): void;
  setInlineStyles(inlineStyle: string): void;
  insertBefore(newChild: BaseLynxElement, refChild: BaseLynxElement): void;
  appendChild(newChild: BaseLynxElement): void;
  addClass(name: string): void;
  removeClass(name: string): void;
  remove(): void;
  parentNode(): BaseLynxElement | null;
  nextSibling(): BaseLynxElement | null;
  querySelector(selector: string): BaseLynxElement | null;
  querySelectorAll(selector: string): BaseLynxElement[];
  addEventListener(name: string, cb: (event: any)=> any): () => void;
}
export class LynxElement implements BaseLynxElement {
  private readonly element: ElementRef;
  constructor(element: ElementRef) {
    this.element = element;
  }

  setProperty(name: string, value: any): void{
    this.setAttribute(name, value);
  }
  setAttribute(name: string, value: any): void {
    if(name === 'class'){
      this.addClass(value);
    } else if(name === 'style'){
      this.setInlineStyles(value);
    } else if(name === 'id'){
      __SetID(this.element, value);
    } else if(name.startsWith('data-')) {
      const data: Record<string, any> = {};
      let key = name.slice(5);
      data[key] = value;
      __SetDataset(this.element, data);
    } else {
      __SetAttribute(this.element, name, value);
    }
  }

  getAttribute(name: string) {
    return __GetAttributeByName(this.element, name) as string;
  }

  removeAttribute(name: string): void{
    this.setAttribute(name, null);
  }

  setStyle(key: string, value: unknown): void {
    __AddInlineStyle(this.element, key, value);
  }
  removeStyle(key: string): void{
    __AddInlineStyle(this.element, key, null);
  }
  setInlineStyles(inlineStyle: string): void {
    __SetInlineStyles(this.element, inlineStyle);
  }

  insertBefore(newChild: LynxElement, refChild: LynxElement): void {
    __InsertElementBefore(this.element, newChild.element, refChild.element);
  }

  appendChild(newChild: LynxElement): void{
    __AppendElement(this.element, newChild.element);
    // should we flush?
  }

  addClass(name: string): void{
    __AddClass(this.element, name);
  }

  removeClass(name: string): void{
    const classes = __GetClasses(this.element)
    .filter(c=> c !== name);
    __SetClasses(this.element, classes.join(' '));
  }

  remove(){
    const parent = this.parentNode()!;
    __RemoveElement(parent.element, this.element);
  }

  parentNode(): LynxElement | null{
    const parent = __GetParent(this.element);
    if(!parent) return null;
    return new LynxElement(parent);
  }

  nextSibling(): LynxElement | null{
    const nextSibling =  __NextElement(this.element);
    if(!nextSibling) return null;
    return new LynxElement(nextSibling);
  }

  querySelector(selector: string): LynxElement | null {
    const element = __QuerySelector(this.element, selector, {});
    if (!element) return null;
    return new LynxElement(element);
  }
  querySelectorAll(selector: string): LynxElement[] {
    return __QuerySelectorAll(this.element, selector, {}).map(
      (e) => new LynxElement(e)
    );

  }
  addEventListener(name: string, cb: (event: any)=> any){
    let eventName = '';
    let eventType = '';
    if(name.startsWith('bind')){
      eventName = name.slice(4);
      eventType = 'bindEvent'
    } else{
      console.log("unsupported event");
      return ()=> {};
    }
    console.log(`adding event ${eventName} ${eventType}`)
    __AddEvent(this.element, eventType, eventName, {
      type: "worklet",
      value: cb,
    });
    return ()=> {
      // cleanup function
    }
  }
}

export class LynxBackgroundElement implements BaseLynxElement{
  private _props = new Map<string, any>();
  private _styles = new Map<string, any>();
  private _classes = new Set<string>();
  private _parent: LynxBackgroundElement | null = null;
  private _firstChild: LynxBackgroundElement | null = null;
  private _lastChild: LynxBackgroundElement | null = null;
  private _previousSibling: LynxBackgroundElement | null = null;
  private _nextSibling: LynxBackgroundElement | null = null;

  setProperty(name: string, value: any): void {
    this._props.set(name, value);
  }
  setAttribute(name: string, value: any): void {
    this._props.set(name, value);
  }
  getAttribute(name: string): string | null {
    return this._props.get(name) ?? null;
  }
  removeAttribute(name: string): void {
    this._props.delete(name);
  }
  setStyle(key: string, value: unknown): void {
    this._styles.set(key, value);
  }
  removeStyle(key: string): void {
    this._styles.delete(key);
  }
  setInlineStyles(inlineStyle: string): void {
    const styles = inlineStyle.split(';').map(s=> s.trim()).filter(s=> s.length > 0);
    styles.forEach(s=> {
      const [key, value] = s.split(':').map(s=> s.trim());
      this.setStyle(key, value);
    });
  }

  insertBefore(newChild: LynxBackgroundElement, refChild: LynxBackgroundElement): void {
    if(!refChild._previousSibling){
      this._firstChild = newChild;
    } else {
      refChild._previousSibling._nextSibling = newChild;
    }
    newChild._previousSibling = refChild._previousSibling;
    refChild._previousSibling = newChild;
    newChild._nextSibling = refChild;
    newChild._parent = this;
  }

  appendChild(newChild: LynxBackgroundElement): void {
    if(!this._firstChild){
      this._firstChild = newChild;
      this._lastChild = newChild;
    } else {
      if (!this._lastChild) {
        throw new Error("Invariant violation: _lastChild is null while _firstChild is not null.");
      }
      this._lastChild._nextSibling = newChild;
      newChild._previousSibling = this._lastChild;
      this._lastChild = newChild;
    }
    newChild._parent = this;
  }

  addClass(name: string): void {
    this._classes.add(name);
  }
  removeClass(name: string): void {
    this._classes.delete(name);
  }
  remove(): void {
    if(!this._parent){
      return;
    }
    if(this._previousSibling){
      this._previousSibling._nextSibling = this._nextSibling;
    } else {
      this._parent._firstChild = this._nextSibling;
    }
    if(this._nextSibling){
      this._nextSibling._previousSibling = this._previousSibling;
    } else {
      this._parent._lastChild = this._previousSibling;
    }
    this._nextSibling = null;
    this._previousSibling = null;
    this._parent = null;
  }

  parentNode(): BaseLynxElement | null {
    return this._parent;
  }
  nextSibling(): BaseLynxElement | null {
    return this._nextSibling;
  }
  querySelector(selector: string): BaseLynxElement | null {
    throw new Error('Method not implemented.');
  }
  querySelectorAll(selector: string): BaseLynxElement[] {
    throw new Error('Method not implemented.');
  }
  addEventListener(name: string, cb: (event: any) => any): () => void {
    console.log('Method not implemented.')
    return () => {}
  }

}
type LynxEventType =
| 'bindEvent'
| 'catchEvent'
| 'capture-bind'
| 'capture-catch';
