# Adding Support for More Lynx Elements

This guide explains how to extend the lynx-angular runtime to support additional Lynx elements.

## Current Element Support

The runtime currently supports these Lynx elements:

- `x-view` - Basic container
- `x-text` - Text display
- `x-raw-text` - Raw text content
- `x-image` - Image display
- `x-scroll-view` - Scrollable container
- `x-list` - List container
- `x-block` - Block element
- `x-if` - Conditional element
- `x-for` - Repetition element

## Adding a New Element Type

To add support for a new Lynx element, follow these steps:

### 1. Check the Lynx API

First, verify that the element type is available in the Lynx runtime by checking the `lib/types/lynx.ts` file for appropriate interfaces and global functions.

Look for:

- An interface like `NewElementRef extends ElementRef`
- A function like `__CreateNewElement(parentComponentUniId: number, info?: ElementInfo): NewElementRef`

### 2. Update the LynxDocument Class

Add a new case in the `createElement` method of the `LynxDocument` class:

```typescript
case 'x-new-element': {
  element = __CreateNewElement(this.pageId);

  // Set default properties if needed
  __SetConfig(element, {
    // Default configuration options for this element type
    propertyA: valueA,
    propertyB: valueB
  });

  break;
}
```

### 3. Update the README

Update the `README.md` file in the runtime project to reflect the newly supported element:

```markdown
### Built-in Elements

- [x] [existing-element](https://lynxjs.org/api/elements/built-in/existing-element.html)
- [x] [new-element](https://lynxjs.org/api/elements/built-in/new-element.html) _(basic support)_
```

### 4. Create Documentation

Add documentation for the new element in the `ELEMENTS.md` file, including:

- What the element does
- Example usage
- Supported attributes/properties
- Common use cases

### 5. Create an Example Component

Create a sample component that demonstrates how to use the new element effectively:

```typescript
@Component({
  selector: "app-new-element-example",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <x-view>
      <x-new-element [property]="value">
        <!-- Content -->
      </x-new-element>
    </x-view>
  `,
})
export class NewElementExampleComponent {
  // Implementation
}
```

## Advanced Element Integration

For more complex elements (like `x-list`), you may need to:

1. Implement callback functions for event handling
2. Add specific configuration options using `__SetConfig`
3. Handle element-specific lifecycle events
4. Add custom event handlers for interaction

## Testing New Elements

To test your newly added element:

1. Create a standalone example component
2. Add it to the routes in `app.routes.ts`
3. Add a navigation link in the main app
4. Test on both the simulator and real devices

## Contributing

If you add support for a new element, please:

1. Document all supported attributes and properties
2. Include reasonable default configurations
3. Add test cases and examples
4. Update the element support table in the README
