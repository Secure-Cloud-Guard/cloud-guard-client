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
    // set delay for 3 seconds
    this.cognitoService.fetchAuthSession().then(session => {

      console.log('session: ', session);
      console.log('session.tokens: ', session);

      // @ts-ignore
      if (document.querySelector('.main-app')?.offsetWidth > 0 && !session.tokens) {
        // window.location.href = environment.authAppUrl;
        console.log("REDIRECT TO AUTH")
      } else {
        this.showApp = true;
      }
    });
  }
}
