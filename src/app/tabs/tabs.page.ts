import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { swapHorizontalOutline, settingsOutline } from 'ionicons/icons';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  templateUrl: './tabs.page.html',
})
export class TabsPage {
  constructor() {
    addIcons({ swapHorizontalOutline, settingsOutline });
  }
}
