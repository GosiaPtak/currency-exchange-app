import { Component, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { swapHorizontalOutline, settingsOutline } from 'ionicons/icons';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { TranslationService } from '../core/translation.service';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  templateUrl: './tabs.page.html',
})
export class TabsPage {
  protected readonly i18n = inject(TranslationService);

  constructor() {
    addIcons({ swapHorizontalOutline, settingsOutline });
  }
}
