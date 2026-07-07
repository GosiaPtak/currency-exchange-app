import { Component, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { informationCircleOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonIcon,
  IonNote,
} from '@ionic/angular/standalone';
import { TranslationService } from '../core/translation.service';
import { Lang } from '../core/i18n';
import { ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-settings',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonNote,
  ],
  templateUrl: './settings.page.html',
})
export class SettingsPage {
  protected readonly i18n = inject(TranslationService);
  protected readonly theme = inject(ThemeService);

  constructor() {
    addIcons({ informationCircleOutline });
  }

  onLangChange(lang: Lang): void {
    this.i18n.setLang(lang);
  }

  onThemeChange(value: string | number | undefined): void {
    if (value === 'light' || value === 'dark' || value === 'system') {
      this.theme.setMode(value);
    }
  }
}
