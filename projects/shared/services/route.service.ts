import { Injectable } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Service for managing frontend routes in an Angular application.
 *
 * @example
 * // Import and inject the RouteService in your component or service:
 * import { RouteService } from '@shared/services';
 *
 * constructor(private routeService: RouteService) {
 *   // Access route information using service methods
 *   const currentUrl = this.routeService.getCurrentUrl();
 *   const currentParams = this.routeService.getCurrentParams();
 *   const currentQueryParams = this.routeService.getCurrentQueryParams();
 * }
 */
@Injectable({
  providedIn: 'root'
})
export class RouteService {
  currentUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscribeToRouterEvents();
    this.setCurrentUrl();
  }

  private subscribeToRouterEvents() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setCurrentUrl();
    });
  }

  /**
   * Get the current URL based on the router state.
   * @returns The current URL.
   */
  getCurrentUrl(): string {
    return this.router.routerState.snapshot.url;
  }

  /**
   * Get the parameters of the current route.
   * @returns {@link Params} The parameters of the current route.
   */
  getCurrentParams(): Params {
    return this.route.snapshot.params;
  }

  /**
   * Get the query parameters of the current route.
   * @returns {@link Params} The query parameters of the current route.
   */
  getCurrentQueryParams(): Params {
    return this.route.snapshot.queryParams;
  }

  private setCurrentUrl() {
    this.currentUrl = this.getCurrentUrl();
  }
}
