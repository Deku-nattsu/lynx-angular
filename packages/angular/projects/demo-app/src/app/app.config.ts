import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideLynxRenderer } from 'runtime';

export const appConfig: ApplicationConfig = {
  providers: [provideExperimentalZonelessChangeDetection(), provideLynxRenderer()]
};
