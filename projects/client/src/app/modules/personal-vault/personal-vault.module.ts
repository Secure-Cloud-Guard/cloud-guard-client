import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalVaultComponent } from "@modules/personal-vault/components";
import { FileManagerComponent } from "@app/components/file-manager/file-manager.component";


@NgModule({
  declarations: [
    PersonalVaultComponent
  ],
  imports: [
    CommonModule,
    FileManagerComponent
  ]
})
export class PersonalVaultModule { }
