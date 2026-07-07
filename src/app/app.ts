import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonRouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Injected so the theme (light/dark/system) is applied as soon as the app boots.
  private readonly themeService = inject(ThemeService);
}
