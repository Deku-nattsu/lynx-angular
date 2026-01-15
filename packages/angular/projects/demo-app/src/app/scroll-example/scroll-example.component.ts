import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-scroll-example',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <x-view class="container">
      <x-text class="title">Scroll View Example</x-text>
      <!-- Horizontal scroll example -->
      <x-text class="subtitle">Horizontal Scroll</x-text>
      <x-scroll-view class="horizontal-scroll" scrollX="true" scrollY="false">
        <x-view class="horizontal-content">
          @for (item of horizontalItems; track item) {
          <x-view class="horizontal-item">
            <x-text class="item-text">{{ item }}</x-text>
          </x-view>
          }
        </x-view>
      </x-scroll-view>
      <!-- Vertical scroll example -->
      <x-text class="subtitle">Vertical Scroll</x-text>
      <x-scroll-view class="vertical-scroll" scrollX="false" scrollY="true">
        <x-view class="vertical-content">
          @for (item of verticalItems; track item) {
          <x-view class="vertical-item">
            <x-text class="item-text">{{ item }}</x-text>
          </x-view>
          }
        </x-view>
      </x-scroll-view>
    </x-view>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        padding: 16px;
        height: 100vh;
        background-color: #f5f5f5;
      }

      .title {
        font-size: 24px;
        margin-bottom: 16px;
        text-align: center;
        font-weight: bold;
      }

      .subtitle {
        font-size: 18px;
        margin: 12px 0;
        font-weight: bold;
      }

      .horizontal-scroll {
        height: 120px;
        background-color: white;
        border-radius: 8px;
        margin-bottom: 24px;
      }

      .horizontal-content {
        display: flex;
        flex-direction: row;
        padding: 16px;
      }

      .horizontal-item {
        min-width: 150px;
        height: 80px;
        background-color: #007bff;
        border-radius: 8px;
        margin-right: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .vertical-scroll {
        flex: 1;
        background-color: white;
        border-radius: 8px;
      }

      .vertical-content {
        padding: 16px;
      }

      .vertical-item {
        height: 80px;
        background-color: #17a2b8;
        border-radius: 8px;
        margin-bottom: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .item-text {
        color: white;
        font-size: 16px;
        font-weight: bold;
      }
    `,
  ],
})
export class ScrollExampleComponent {
  horizontalItems = [
    'Horizontal 1',
    'Horizontal 2',
    'Horizontal 3',
    'Horizontal 4',
    'Horizontal 5',
    'Horizontal 6',
    'Horizontal 7',
    'Horizontal 8',
  ];

  verticalItems = [
    'Vertical 1',
    'Vertical 2',
    'Vertical 3',
    'Vertical 4',
    'Vertical 5',
    'Vertical 6',
    'Vertical 7',
    'Vertical 8',
    'Vertical 9',
    'Vertical 10',
  ];
}
