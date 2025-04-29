import type { Type, ApplicationConfig, ApplicationRef } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { firstValueFrom, Subject } from "rxjs";

// @ts-ignore
globalThis.renderPage = () => {
  pageReady.next();
};

// @ts-ignore
globalThis.updatePage = () => { };
// @ts-ignore
globalThis.processData = () => { };
// @ts-ignore
globalThis.runWorklet = (value, params) => {
  if (typeof value === "function") {
    value(...params);
  }
};

const pageReady = new Subject<void>();

// const renderLynx = (cb: ()=> void): void => {
//   if(__MAIN_THREAD__){
//     pageReady.pipe(first()).subscribe(()=> {
//       cb();
//     });
//   } else {
//     cb();
//   }
// }



export const bootstrapLynxApplication = async (rootComponent: Type<unknown>, options?: ApplicationConfig): Promise<ApplicationRef> => {
  // should we provide lynxRenderer here or let the consumer do it?
  if (__MAIN_THREAD__) {
    await firstValueFrom(pageReady);
    return bootstrapApplication(rootComponent, options);
  }
  return bootstrapApplication(rootComponent, options);
}