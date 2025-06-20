# Angular Runtime for Lynx

> 🚧 **Work in Progress**  
> This is an early proof of concept. Only a minimal subset of Angular features is currently supported.

## Progress

### Built-in Elements

- [x] [view](https://lynxjs.org/api/elements/built-in/view.html)
- [x] [text](https://lynxjs.org/api/elements/built-in/text.html) _(basic rendering only)_
- [x] [image](https://lynxjs.org/api/elements/built-in/image.html) _(basic rendering only)_
- [x] [scroll-view](https://lynxjs.org/api/elements/built-in/scroll-view.html) _(basic rendering only)_
- [x] [list](https://lynxjs.org/api/elements/built-in/list.html) _(basic implementation, needs further development)_
- [x] [block](https://lynxjs.org/api/elements/built-in/block.html) _(basic support)_
- [x] [if](https://lynxjs.org/api/elements/built-in/if.html) _(basic support)_
- [x] [for](https://lynxjs.org/api/elements/built-in/for.html) _(basic support)_

### Styling Support

- [x] No encapsulation (global styles)
- [ ] Emulated encapsulation (Angular’s default)
- [ ] Inline styles via `style` property in `@Component` decorator

### Developer Experience (DX)

- [ ] Hot Module Replacement (HMR)
- [ ] Live reload during development
- [ ] Compiler warnings & error messages

### Threading Model

- [ ] Support for directives running in the background thread only
- [ ] Communication between background and main thread via worklets
