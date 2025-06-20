import type { ElementRef, ListElementRef } from './types/lynx';
import {
  BaseLynxElement,
  LynxBackgroundElement,
  LynxElement,
} from './lynx-element';

export class LynxDocument {
  page!: LynxElement;
  private pageId = 0;

  constructor() {
    console.log('main thread lynx document');
  }
  createRootElement(): LynxElement {
    const pageElement = __CreatePage('0', 0);
    this.page = new LynxElement(pageElement);
    this.pageId = __GetElementUniqueID(pageElement);
    return this.page;
  }
  createElement(tag: string, value?: string): LynxElement {
    let element: ElementRef;
    switch (tag) {
      case 'x-view': {
        element = __CreateView(this.pageId);
        break;
      }
      case 'x-image': {
        element = __CreateImage(this.pageId);

        // Set default image properties
        __SetConfig(element, {
          mode: 'aspectFit', // Default to maintaining aspect ratio
          fadeIn: true, // Enable image fade-in effect
          loadingPlaceholder: '', // No default placeholder
        });

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

        // Set default scroll-view properties for better performance
        __SetConfig(element, {
          bounces: true, // Enable bouncing effect when scrolling past the edge
          showScrollIndicator: true, // Show scroll indicators
          pagingEnabled: false, // Disable paging by default
          scrollsToTop: true, // Enable scrolling to top when tapping the status bar
          decelerationRate: 'normal', // Use normal deceleration rate
        });

        break;
      }
      case 'x-list': {
        // For list elements, we need to provide callbacks for handling component creation at specific indices
        // These callbacks facilitate virtualized list rendering

        // This callback is called when the list needs to render a component at a specific index
        const componentAtIndex = (
          listRef: ListElementRef,
          listId: number,
          cellIndex: number,
          opId: number
        ) => {
          console.log(
            `List ${listId} requesting component at index ${cellIndex}`
          );

          // For now, we return undefined which tells Lynx to use a default cell renderer
          // In a more advanced implementation, you would return component identifiers
          // based on your data model and cell reuse strategy
          return undefined;
        };

        // This callback is called when a component (cell) needs to be prepared for rendering
        const enqueueComponent = (
          listRef: ListElementRef,
          listId: number,
          eleId: number
        ) => {
          console.log(`List ${listId} enqueuing component with id ${eleId}`);

          // In a more advanced implementation, this would queue the cell for data binding
          // and prepare it for rendering in the virtualized list
        };

        element = __CreateList(this.pageId, componentAtIndex, enqueueComponent);

        // Set default list properties
        __SetConfig(element, {
          recycleEnabled: true, // Enable cell recycling for better performance
          estimatedItemSize: 60, // Default estimated height for cells (in pixels)
          overscrollEnabled: true, // Enable overscroll effect
        });

        break;
      }
      case 'x-block': {
        element = __CreateBlock(this.pageId);
        break;
      }
      case 'x-if': {
        element = __CreateIf(this.pageId);
        break;
      }
      case 'x-for': {
        element = __CreateFor(this.pageId);
        break;
      }
      default: {
        console.warn(
          `Unknown element tag "${tag}". Falling back to view element.`
        );
        element = __CreateView(this.pageId);
      }
    }
    return new LynxElement(element!);
  }
  createText(value: string): LynxElement {
    const text = __CreateRawText(value);
    const lynxElement = new LynxElement(text);
    return lynxElement;
  }
  createComment(): LynxElement {
    // TODO: this i think should be raw text
    const nonElement = __CreateNonElement(this.pageId);
    return new LynxElement(nonElement);
  }
  appendChild(newChild: LynxElement): void {
    this.page.appendChild(newChild);
  }
}

export class LynxBackgroundDocument implements LynxDocumentBase {
  _page: LynxBackgroundElement | null = null;

  constructor() {
    console.log('background thread lynx document');
  }
  createRootElement(): LynxBackgroundElement {
    const page = new LynxBackgroundElement();
    page.setAttribute('tagName', 'x-page');
    this._page = page;
    return this._page;
  }
  createElement(tag: string, value?: string): LynxBackgroundElement {
    // In the background thread, we create virtual elements but store their tag name
    // to help with debugging and potential future synchronization
    const element = new LynxBackgroundElement();
    element.setAttribute('tagName', tag);

    // For debugging purposes, store text content if provided
    if (value) {
      element.setAttribute('textContent', value);
    }

    console.log(`Creating background element for tag: ${tag}`);
    return element;
  }
  createText(value: string): LynxBackgroundElement {
    const element = new LynxBackgroundElement();
    element.setAttribute('tagName', 'x-text');
    element.setAttribute('textContent', value);
    return element;
  }
  createComment(): LynxBackgroundElement {
    const element = new LynxBackgroundElement();
    element.setAttribute('tagName', 'x-comment');
    return element;
  }
  appendChild(newChild: LynxBackgroundElement): void {
    this._page?.appendChild(newChild);
  }
}

export interface LynxDocumentBase {
  createRootElement(): BaseLynxElement;
  createElement(tag: string, value?: string): BaseLynxElement;
  createText(value: string): BaseLynxElement;
  createComment(): BaseLynxElement;
  appendChild(newChild: BaseLynxElement): void;
}
