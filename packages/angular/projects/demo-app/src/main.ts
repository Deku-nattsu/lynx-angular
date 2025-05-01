import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { bootstrapLynxApplication } from 'runtime';

bootstrapLynxApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
