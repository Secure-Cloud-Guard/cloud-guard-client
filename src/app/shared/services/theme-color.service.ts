import { Injectable } from '@angular/core';
import { Theme, ThemeService } from "@shared";

@Injectable({
  providedIn: 'root'
})
export class ThemeColorService {

  constructor(
    private themeService: ThemeService
  ) { }

  public getPrimaryColor() {
    return this.themeService.theme === Theme.Light ? 'primary' : 'accent';
  }
}
