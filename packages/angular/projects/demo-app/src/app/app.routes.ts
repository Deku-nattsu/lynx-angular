import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./app.component').then((m) => m.AppComponent),
  },
  {
    path: 'list-example',
    loadComponent: () =>
      import('./list-example/list-example.component').then(
        (m) => m.ListExampleComponent
      ),
  },
  {
    path: 'scroll-example',
    loadComponent: () =>
      import('./scroll-example/scroll-example.component').then(
        (m) => m.ScrollExampleComponent
      ),
  },
  {
    path: 'showcase',
    loadComponent: () =>
      import('./elements-showcase/elements-showcase.component').then(
        (m) => m.ElementsShowcaseComponent
      ),
  },
];
