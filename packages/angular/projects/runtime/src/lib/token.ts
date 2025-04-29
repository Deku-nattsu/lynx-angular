import { InjectionToken } from "@angular/core";
import type { LynxDocumentBase } from "./lynx-document";

export const LYNX_DOCUMENT = new InjectionToken<LynxDocumentBase>('lynx-document');
