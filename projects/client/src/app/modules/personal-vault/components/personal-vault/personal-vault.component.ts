import { Component } from '@angular/core';
import { FileManagerType } from "@types";


@Component({
  selector: 'app-personal-vault',
  templateUrl: './personal-vault.component.html'
})
export class PersonalVaultComponent {
  protected readonly FileManagerType = FileManagerType;
}
