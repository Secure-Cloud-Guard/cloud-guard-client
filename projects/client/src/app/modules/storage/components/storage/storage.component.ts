import { Component } from '@angular/core';
import {FileManagerType} from "@types";

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html'
})
export class StorageComponent {

    protected readonly FileManagerType = FileManagerType;
}
