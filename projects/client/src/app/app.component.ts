import { Component, OnInit } from '@angular/core';
import { CognitoService } from "@globalShared";
import { environment } from "../../../../src/environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showApp: boolean = false;

  constructor(
    private cognitoService: CognitoService
  ) { }

  ngOnInit(): void {

    // @ts-ignore
    if (document.querySelector('.main-app')?.offsetWidth > 0) {
      const cookies = this.getAllCookies();

      for (const key in cookies) {
        if (cookies.hasOwnProperty(key)) {
          localStorage.setItem(key, cookies[key]);
        }
      }
    }

    this.cognitoService.fetchAuthSession().then(session => {
      // @ts-ignore
      if (document.querySelector('.main-app')?.offsetWidth > 0 && !session.tokens) {
        window.location.href = environment.authAppUrl;
      } else {
        this.showApp = true;
      }
    });
  }

  getAllCookies(): { [key: string]: string } {
    const cookies: { [key: string]: string } = {};
    document.cookie.split(';').forEach(cookie => {
      const [key, value] = cookie.split('=').map(c => c.trim());
      cookies[key] = decodeURIComponent(value);
    });
    return cookies;
  }
}
