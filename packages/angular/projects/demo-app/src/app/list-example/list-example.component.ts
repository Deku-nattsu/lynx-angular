import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-list-example',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <x-view class="list-container">
      <x-text class="title">List Example</x-text>
      <!-- Simple list example -->
      <x-list class="list">
        <!-- List will be populated with list items -->
        @for (item of items; track item.id) {
        <x-view class="list-item">
          <x-text class="item-text">{{ item.text }}</x-text>
        </x-view>
        }
      </x-list>

      <x-view class="button-container">
        <x-view class="button" (bindtap)="addItem()">
          <x-text class="button-text">Add Item</x-text>
        </x-view>
      </x-view>
    </x-view>
  `,
  styles: [
    `
      .list-container {
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

      .list {
        flex: 1;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 16px;
      }

      .list-item {
        padding: 16px;
        border-bottom: 1px solid #e0e0e0;
      }

      .item-text {
        font-size: 16px;
      }

      .button-container {
        display: flex;
        justify-content: center;
      }

      .button {
        background-color: #007bff;
        border-radius: 8px;
        padding: 12px 24px;
      }

      .button-text {
        color: white;
        font-size: 16px;
        text-align: center;
      }
    `,
  ],
})
export class ListExampleComponent {
  items = [
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
    { id: 3, text: 'Item 3' },
  ];

  nextId = 4;

  addItem() {
    this.items = [
      ...this.items,
      { id: this.nextId, text: `Item ${this.nextId}` },
    ];
    this.nextId++;
  }
}
