import { Injectable } from '@angular/core';
import { PROJECT } from "../const";

/**
 * Service to manage the current project in the application.
 */
@Injectable({
  providedIn: 'root'
})
export class CurrentProjectService {

  /** Holds the current project value */
  currentProject: string = PROJECT.AUTH

  /**
   * Sets the current project value.
   *
   * @method setCurrentProject
   * @param {string} project - The project to set as the current project.
   * @returns {void}
   */
  public setCurrentProject(project: string): void {
    this.currentProject = project;
  }

  /**
   * Retrieves the current project value.
   *
   * @method getCurrentProject
   * @returns {String} The current project value.
   */
  public getCurrentProject(): string {
    return this.currentProject;
  }
}
