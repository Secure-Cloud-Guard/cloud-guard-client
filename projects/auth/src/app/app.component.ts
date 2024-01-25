import { Component } from '@angular/core';
import { CurrentProjectService, PROJECT } from "@globalShared";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private currentProject: CurrentProjectService) {
    currentProject.setCurrentProject(PROJECT.AUTH);
  }
}
