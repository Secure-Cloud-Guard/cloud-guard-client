import { Component } from '@angular/core';
import { CognitoService } from "@globalShared";

@Component({
  selector: 'app-personal-vault',
  templateUrl: './personal-vault.component.html'
})
export class PersonalVaultComponent {

  constructor(private cognitoService: CognitoService) {}

  test() {
    console.log(this.cognitoService.fetchAuthSession());
    console.log(this.cognitoService.currentAuthenticatedUser());
  }
}
