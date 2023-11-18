import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, take } from 'rxjs';
import { NavigationType } from "@modules/home/types";

/**
 * Service that manages the navigation type based on screen width.
 */
@Injectable({
  providedIn: 'root'
})
export class NavService {
  private navigationTypeSubject = new BehaviorSubject<string>(NavigationType.Sidenav);

  constructor() {
    this.updateNavigationType();

    interval(1000)
      .pipe(take(Infinity))
      .subscribe(() => {
        this.updateNavigationType();
      });
  }

  private updateNavigationType(): void {
    const screenWidth = window.innerWidth;
    if (screenWidth < 640) {
      this.navigationTypeSubject.next(NavigationType.TabGroup);
    } else {
      this.navigationTypeSubject.next(NavigationType.Sidenav);
    }
  }

  /**
   * Checks if the side navigation is currently shown.
   * @returns {boolean}
   */
  public isSidenavShown(): boolean {
    return this.navigationTypeSubject.value === NavigationType.Sidenav;
  }

  /**
   * Checks if the tab group navigation is currently shown.
   * @returns {boolean}
   */
  public isTabGroupShown(): boolean {
    return this.navigationTypeSubject.value === NavigationType.TabGroup;
  }
}
