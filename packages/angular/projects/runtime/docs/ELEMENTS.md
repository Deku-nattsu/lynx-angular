# Lynx Elements in Angular

This document explains how to use Lynx elements in your Angular applications.

## Available Elements

The lynx-angular runtime currently supports the following elements:

### Basic Elements

- **`<x-view>`**: A basic container element (similar to a div)
- **`<x-text>`**: For displaying text content
- **`<x-image>`**: For displaying images
- **`<x-raw-text>`**: For rendering raw text without processing

### Layout Elements

- **`<x-scroll-view>`**: A scrollable container that supports both horizontal and vertical scrolling
- **`<x-list>`**: A container optimized for displaying lists of items

### Structural Elements

- **`<x-block>`**: A container for grouping elements
- **`<x-if>`**: Used for conditional rendering (though Angular's `@if` built-in control flow is typically used instead)
- **`<x-for>`**: Used for list rendering (though Angular's `@for` built-in control flow is typically used instead)

## Using Elements

### Basic Usage

All Lynx elements should be used with the `CUSTOM_ELEMENTS_SCHEMA` to avoid Angular compilation errors:

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-example",
  templateUrl: "./example.component.html",
  styleUrls: ["./example.component.css"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExampleComponent {}
```

### View Element

The view element is the basic building block for layouts:

```html
<x-view class="container">
  <x-text>Hello World</x-text>
</x-view>
```

### Text Element

Use the text element to display text:

```html
<x-text class="title">This is a title</x-text> <x-text class="body">This is some content</x-text>
```

### Image Element

The image element displays images:

```html
<x-image [src]="imageUrl" class="profile-image"></x-image>
```

### Scroll View

The scroll view enables scrollable content:

```html
<!-- Vertical scrolling -->
<x-scroll-view scrollY="true" class="vertical-scroll">
  <x-view class="content">
    <!-- Content here -->
  </x-view>
</x-scroll-view>

<!-- Horizontal scrolling -->
<x-scroll-view scrollX="true" class="horizontal-scroll">
  <x-view class="content">
    <!-- Content here -->
  </x-view>
</x-scroll-view>
```

### List Element

The list element is optimized for rendering lists:

```html
<x-list class="item-list">
  @for (item of items; track item.id) {
  <x-view class="list-item">
    <x-text>{{item.name}}</x-text>
  </x-view>
  }
</x-list>
```

## Event Handling

Lynx elements support events with the `bind` prefix:

```html
<x-view class="button" (bindtap)="onTap($event)">
  <x-text>Tap me</x-text>
</x-view>
```

## Styling

You can style elements using CSS classes or inline styles:

```html
<!-- Using classes -->
<x-view class="container">
  <x-text class="title">Title</x-text>
</x-view>

<!-- Using inline styles -->
<x-view style="display: flex; flex-direction: column;">
  <x-text style="font-size: 18px; color: blue;">Styled text</x-text>
</x-view>
```

## Best Practices

1. **Use Angular's built-in control flow** (`@if`, `@for`) instead of the corresponding Lynx elements for better integration with Angular.

2. **Prefer class-based styling** over inline styles for better maintainability.

3. **Group related elements** in view containers to create logical sections of your UI.

4. **Use scroll views judiciously** as they create additional container layers.

5. **Be mindful of nesting levels** - deeply nested elements can impact performance.

## Example: A Complete Component

```typescript
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

@Component({
  selector: "app-user-profile",
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <x-view class="profile-container">
      <x-view class="header">
        <x-image [src]="user.avatarUrl" class="avatar"></x-image>
        <x-text class="username">{{ user.name }}</x-text>
      </x-view>

      <x-scroll-view scrollY="true" class="posts-container">
        <x-list class="posts-list">
          @for (post of user.posts; track post.id) {
          <x-view class="post-item">
            <x-text class="post-title">{{ post.title }}</x-text>
            <x-text class="post-content">{{ post.content }}</x-text>
            <x-view class="like-button" (bindtap)="likePost(post.id)">
              <x-text>Like</x-text>
            </x-view>
          </x-view>
          }
        </x-list>
      </x-scroll-view>
    </x-view>
  `,
  styles: [
    `
      .profile-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
      }

      .header {
        display: flex;
        align-items: center;
        padding: 16px;
        background-color: #f5f5f5;
      }

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        margin-right: 16px;
      }

      .username {
        font-size: 18px;
        font-weight: bold;
      }

      .posts-container {
        flex: 1;
      }

      .post-item {
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
      }

      .post-title {
        font-weight: bold;
        margin-bottom: 8px;
      }

      .like-button {
        margin-top: 8px;
        padding: 8px 16px;
        background-color: #007bff;
        border-radius: 4px;
        align-self: flex-start;
      }

      .like-button x-text {
        color: white;
      }
    `,
  ],
})
export class UserProfileComponent {
  user = {
    name: "Jane Doe",
    avatarUrl: "assets/avatar.png",
    posts: [
      { id: 1, title: "First Post", content: "This is my first post" },
      { id: 2, title: "Second Post", content: "This is my second post" },
      { id: 3, title: "Third Post", content: "This is my third post" },
    ],
  };

  likePost(postId: number) {
    console.log(`Liked post ${postId}`);
  }
}
```
