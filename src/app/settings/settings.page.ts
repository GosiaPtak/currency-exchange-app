import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
  templateUrl: './settings.page.html',
})
export class SettingsPage {}
