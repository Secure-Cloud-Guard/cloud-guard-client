import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { ThemeService, Theme } from "@globalShared";

declare var particlesJS: any;

/**
 * Particle component for managing and toggling the visibility of particles based on the theme.
 *
 * This component provides functionality for displaying particles in the background and allows users
 * to toggle their visibility. It subscribes to theme changes and loads the appropriate particle configuration
 * based on the current theme. Particles can be shown or hidden using the {@link particlesToggle} method.
 *
 * To use this component, ensure that the particles.js library is available.
 *
 * @see ThemeService
 * @see particlesToggle
 * @see loadParticles
 */
@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html'
})
export class ParticlesComponent implements OnInit, OnDestroy {
  private _isParticlesVisible: boolean = true;
  private themeChangeSubscription!: Subscription;

  constructor(
    protected readonly themeService: ThemeService
  ) { }

  ngOnInit() {
    this.themeChangeSubscription = this.themeService.onChange.subscribe(this.loadParticles);
  }

  ngOnDestroy() {
    this.themeChangeSubscription.unsubscribe();
  }

  isParticlesVisible(): boolean {
    return this._isParticlesVisible;
  }

  particlesToggle() {
    this._isParticlesVisible = !this._isParticlesVisible;

    if (this._isParticlesVisible) {
      this.loadParticles(this.themeService.theme);
    }
  }

  private loadParticles(theme: Theme) {
    const particlesJsonPath = theme === Theme.Light
      ? '../assets/particles/particles-light-theme.json'
      : '../assets/particles/particles-dark-theme.json';

    particlesJS.load('particles-container', particlesJsonPath, null);
  }
}
