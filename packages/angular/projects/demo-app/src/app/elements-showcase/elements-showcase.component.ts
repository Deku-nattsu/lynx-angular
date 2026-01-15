import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import lynxLogo from '../../assets/lynx-logo.png';
import angularLogo from '../../assets/angular-logo.png';

@Component({
  selector: 'app-elements-showcase',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <x-view class="container">
      <x-text class="title">Lynx Elements Showcase</x-text>

      <!-- Basic Elements Section -->
      <x-view class="section">
        <x-text class="section-title">Basic Elements</x-text>

        <x-view class="card">
          <x-text class="element-name">x-view</x-text>
          <x-view class="element-example">
            <x-view class="colored-box"></x-view>
          </x-view>
          <x-text class="description"
            >Basic container element, similar to a div</x-text
          >
        </x-view>

        <x-view class="card">
          <x-text class="element-name">x-text</x-text>
          <x-view class="element-example">
            <x-text class="styled-text">Hello, World!</x-text>
          </x-view>
          <x-text class="description"
            >Text element for displaying content</x-text
          >
        </x-view>

        <x-view class="card">
          <x-text class="element-name">x-image</x-text>
          <x-view class="element-example">
            <x-image [src]="images.lynx" class="logo-image"></x-image>
          </x-view>
          <x-text class="description"
            >Image element for displaying images</x-text
          >
        </x-view>
      </x-view>

      <!-- Layout Elements Section -->
      <x-view class="section">
        <x-text class="section-title">Layout Elements</x-text>

        <x-view class="card">
          <x-text class="element-name">x-scroll-view</x-text>
          <x-view class="element-example">
            <x-scroll-view class="mini-scroll" scrollX="true">
              <x-view class="scroll-content">
                @for (i of [1, 2, 3, 4, 5]; track i) {
                <x-view class="scroll-item">
                  <x-text>Item {{ i }}</x-text>
                </x-view>
                }
              </x-view>
            </x-scroll-view>
          </x-view>
          <x-text class="description">Scrollable container for content</x-text>
        </x-view>

        <x-view class="card">
          <x-text class="element-name">x-list</x-text>
          <x-view class="element-example">
            <x-list class="mini-list">
              @for (i of [1, 2, 3]; track i) {
              <x-view class="list-item">
                <x-text>List Item {{ i }}</x-text>
              </x-view>
              }
            </x-list>
          </x-view>
          <x-text class="description"
            >Optimized container for list items</x-text
          >
        </x-view>
      </x-view>

      <!-- Structural Elements -->
      <x-view class="section">
        <x-text class="section-title">Structural Elements</x-text>

        <x-view class="card">
          <x-text class="element-name">x-block</x-text>
          <x-view class="element-example">
            <x-block class="block-example">
              <x-view class="block-item"></x-view>
              <x-view class="block-item"></x-view>
            </x-block>
          </x-view>
          <x-text class="description">Container for grouping elements</x-text>
        </x-view>

        <x-view class="card">
          <x-text class="element-name">Conditional Rendering</x-text>
          <x-view class="element-example">
            <x-view class="toggle-container" (bindtap)="toggleVisibility()">
              <x-text>Toggle</x-text>
            </x-view>

            @if (isVisible) {
            <x-view class="conditional-element">
              <x-text>I'm visible!</x-text>
            </x-view>
            }
          </x-view>
          <x-text class="description"
            >Using Angular's if control flow for conditionals</x-text
          >
        </x-view>

        <x-view class="card">
          <x-text class="element-name">List Rendering</x-text>
          <x-view class="element-example">
            <x-view class="list-render-example">
              @for (item of listItems; track item; let i = $index) {
              <x-view class="list-render-item">
                <x-text>{{ i + 1 }}. {{ item }}</x-text>
              </x-view>
              }
            </x-view>
          </x-view>
          <x-text class="description"
            >Using Angular's for control flow for lists</x-text
          >
        </x-view>
      </x-view>

      <!-- Events Demo -->
      <x-view class="section">
        <x-text class="section-title">Event Handling</x-text>

        <x-view class="card">
          <x-text class="element-name">Tap Event</x-text>
          <x-view class="element-example">
            <x-view class="event-button" (bindtap)="handleTap()">
              <x-text>Tap Me</x-text>
            </x-view>
            <x-text class="tap-count">Taps: {{ tapCount }}</x-text>
          </x-view>
          <x-text class="description">Using bindtap event handler</x-text>
        </x-view>
      </x-view>
    </x-view>
  `,
  styles: [
    `
      .container {
        padding: 16px;
        background-color: #f5f5f5;
        min-height: 100vh;
      }

      .title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 24px;
      }

      .section {
        margin-bottom: 32px;
      }

      .section-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 16px;
        color: #444;
      }

      .card {
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .element-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
        color: #007bff;
      }

      .element-example {
        background-color: #f9f9f9;
        border-radius: 4px;
        padding: 16px;
        margin: 8px 0;
        min-height: 60px;
      }

      .description {
        font-size: 14px;
        color: #666;
      }

      .colored-box {
        width: 60px;
        height: 60px;
        background-color: #007bff;
        border-radius: 4px;
      }

      .styled-text {
        font-size: 18px;
        font-weight: bold;
        color: #28a745;
      }

      .logo-image {
        width: 60px;
        height: 60px;
      }

      .mini-scroll {
        height: 60px;
      }

      .scroll-content {
        display: flex;
        flex-direction: row;
      }

      .scroll-item {
        min-width: 80px;
        height: 40px;
        margin-right: 8px;
        background-color: #007bff;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .scroll-item x-text {
        color: white;
      }

      .mini-list {
        height: 120px;
      }

      .list-item {
        padding: 8px;
        border-bottom: 1px solid #eee;
      }

      .block-example {
        display: flex;
        flex-direction: row;
      }

      .block-item {
        width: 40px;
        height: 40px;
        background-color: #dc3545;
        margin-right: 8px;
        border-radius: 4px;
      }

      .toggle-container {
        background-color: #17a2b8;
        padding: 8px 16px;
        border-radius: 4px;
        margin-bottom: 8px;
        align-self: flex-start;
      }

      .toggle-container x-text {
        color: white;
      }

      .conditional-element {
        background-color: #ffc107;
        padding: 8px;
        border-radius: 4px;
      }

      .list-render-example {
        background-color: #f8f9fa;
        border-radius: 4px;
        padding: 8px;
      }

      .list-render-item {
        padding: 4px 0;
      }

      .event-button {
        background-color: #28a745;
        padding: 8px 16px;
        border-radius: 4px;
        margin-bottom: 8px;
        align-self: flex-start;
      }

      .event-button x-text {
        color: white;
      }

      .tap-count {
        margin-top: 8px;
        font-weight: bold;
      }
    `,
  ],
})
export class ElementsShowcaseComponent {
  images = {
    lynx: lynxLogo,
    angular: angularLogo,
  };

  isVisible = true;

  tapCount = 0;

  listItems = ['Apple', 'Banana', 'Cherry'];

  toggleVisibility(): void {
    this.isVisible = !this.isVisible;
  }

  handleTap(): void {
    this.tapCount++;
  }
}
