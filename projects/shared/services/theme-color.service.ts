import { Injectable } from '@angular/core';
import { ThemeService } from "../services";
import { Theme } from "../types";

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
