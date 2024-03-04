import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageComponent } from '@modules/storage/components';
import {FileManagerComponent} from "@app/components/file-manager/file-manager.component";


@NgModule({
  declarations: [
    StorageComponent
  ],
    imports: [
        CommonModule,
        FileManagerComponent
    ]
})
export class StorageModule { }
