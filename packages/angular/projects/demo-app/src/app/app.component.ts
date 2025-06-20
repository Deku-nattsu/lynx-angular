import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { Router } from '@angular/router';
import type { TouchEvent } from '@lynx-js/types';
import arrow from '../assets/arrow.png';
import lynxLogo from '../assets/lynx-logo.png';
import angularLogo from '../assets/angular-logo.png';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  alterLogo = signal(false);

  constructor(private router: Router) {}

  onTap(event: TouchEvent) {
    console.log(event);
    this.alterLogo.update((value) => !value);
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  get arrow() {
    return arrow;
  }

  get lynxLogo() {
    return lynxLogo;
  }

  get angularLogo() {
    return angularLogo;
  }
}
