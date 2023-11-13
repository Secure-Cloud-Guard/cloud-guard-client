import { Component } from '@angular/core';
import { LoginService } from "@modules/auth/services";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    protected readonly loginService: LoginService
  ) {}
}
