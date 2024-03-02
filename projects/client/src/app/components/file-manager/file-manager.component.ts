import { AfterViewInit, Component, Inject, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxFilesizeModule } from "ngx-filesize";
import { FileManagerType, FileNode, VIEW_MODE } from "@types";
import { AlertService, CognitoService, Theme, ThemeColorService, ThemeService } from "@globalShared";
import { S3Service } from "@services";
import { CryptoService } from "@app/services/crypto.service";

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatIconModule, MatButtonModule, MatTooltipModule, MatInputModule, MatCardModule, MatTableModule, NgxFilesizeModule, MatMenuModule, MatProgressBarModule],
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent implements AfterViewInit {
  @Input() type: FileManagerType = FileManagerType.Storage;

  @ViewChild('clickFileManagerTrigger') clickFileManagerTrigger: MatMenuTrigger | undefined;
  @ViewChild('clickFileTrigger') clickFileTrigger: MatMenuTrigger | undefined;
  fileManagerMenuTopLeft =  {x: 0, y: 0}
  fileMenuTopLeft =  {x: 0, y: 0}

  protected readonly Theme = Theme;
  protected readonly VIEW_MODE = VIEW_MODE;
  viewMode: string = VIEW_MODE.MODULE;
  currentPath: string[] = [];
  private pendingTreeClick: any;
  listColumns: string[] = ['icon', 'name', 'type', 'size', 'lastModified'];
  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();
  private fileTree: FileNode[] = [];
  currentFolderFiles: FileNode[] = [];
  uploadingFiles: any[] = [];
  showUploading: boolean = false;

  constructor(
    protected readonly themeService: ThemeService,
    private cognitoService: CognitoService,
    private s3Service: S3Service,
    private alertService: AlertService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
    public themeColorService: ThemeColorService,
    private cryptoService: CryptoService
  ) {
    const fileIconMapping: { [key: string]: string } = {
      'pdf': 'pdf.svg',
      'doc': 'doc.svg',
      'docx': 'doc.svg',
      'xls': 'xls.svg',
      'xlsx': 'xls.svg',
      'xlsm': 'xls.svg',
      'txt': 'txt.svg',
      'mp3': 'mp3.svg',
      'mp4': 'mp4.svg',
      'zip': 'zip.svg',
      'rar': 'zip.svg',
      'image': 'img.svg',
      'jpg': 'img.svg',
      'jpeg': 'img.svg',
      'png': 'img.svg',
      'file': 'file.svg',
    };

    Object.entries(fileIconMapping).forEach(([extension, icon]) => {
      this.matIconRegistry.addSvgIcon(
        extension,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`assets/icons/${icon}`)
      );
    });

    this.viewMode = localStorage.getItem('fileManagerViewMode') === VIEW_MODE.MODULE ? VIEW_MODE.MODULE : VIEW_MODE.LIST;

    this.cognitoService.getAccessToken().then(accessToken => {
      if (accessToken) {
        this.refresh();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initDropzone();
  }

  async refresh(currentPath?: string[]) {
    this.fileTree = await this.s3Service.getObjects(this.type);
    this.dataSource.data = this.getFolderTree(this.fileTree);
    this.currentPath = currentPath ?? ['/'];
    this.currentFolderFiles = this.currentFolderContent();
    this.updateActiveFolder();
  }

  openFileManagerMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.fileManagerMenuTopLeft.x = event.clientX;
    this.fileManagerMenuTopLeft.y = event.clientY;
    this.clickFileManagerTrigger?.openMenu();
  }

  openFileMenu(event: MouseEvent, file: FileNode) {
    event.preventDefault();
    event.stopPropagation();

    this.fileMenuTopLeft.x = event.clientX;
    this.fileMenuTopLeft.y = event.clientY;

    if (this.clickFileTrigger) {
      this.clickFileTrigger.menuData = { item: file };
      this.clickFileTrigger?.openMenu();
    }
  }

  async download(object: FileNode) {
    const res = await this.s3Service.downloadObject(this.type, object.url, object.isFolder);
    if (res) {
      this.alertService.success(`The ${object.name} successfully downloaded`);
    }
  }

  async deleteObject(object: FileNode) {
    const res = await this.s3Service.deleteObject(this.type, object.url, object.isFolder);
    if (res) {
      this.alertService.success(`The ${object.name} successfully deleted`);
      this.refresh(this.currentPath);
    }
  }

  getTypeByName(fileName: string): string {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }

  getType(object: FileNode): string {
    if (object.isFolder) {
      return 'Folder';
    }
    return this.getTypeByName(object.name);
  }

  getSvgIconByType(fileType: string): string {
    const icons = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'xlsm', 'txt', 'mp3', 'mp4', 'zip', 'rar', 'jpg', 'jpeg', 'png'];
    return icons.includes(fileType) ? fileType : 'file';
  }
  getSvgIcon(object: FileNode): string {
    const fileType = this.getType(object);
    return this.getSvgIconByType(fileType);
  }

  hasChild = (_: number, node: FileNode) => {
    return !!node.children && node.children.length > 0;
  };

  private getFolderTree(data: FileNode[]): FileNode[] {
    const copiedData: FileNode[] = JSON.parse(JSON.stringify(data));

    function traverseFilter(node: FileNode): boolean {
      if (!node.isFolder) {
        return false;
      }
      if (node.children) {
        node.children = node.children.filter(child => traverseFilter(child));
      }
      return true;
    }

    return copiedData?.filter(root => traverseFilter(root));
  }

  private currentFolderContent(): FileNode[] {
    let currentFolder: FileNode[] = this.fileTree;

    this.currentPath.forEach(folderName => {
      const subFolder = currentFolder?.find(node => node.name === folderName && node.isFolder);
      if (subFolder) {
        currentFolder = subFolder.children || [];
      }
    });

    // Set image preview
    currentFolder?.forEach(async file => {
      if (['jpg', 'jpeg', 'png'].includes(this.getType(file))) {
        file.isImage = true;
        file.imageBase64 = await this.s3Service.getImagePreview(this.type, file.url);
      }
    });

    // Sort objects from currentFolder: folders first, then files
    currentFolder?.sort((a, b) => {
      if (a.isFolder && !b.isFolder) {
        return -1;
      } else if (!a.isFolder && b.isFolder) {
        return 1;
      } else {
        return 0;
      }
    });

    return currentFolder;
  }

  openFromList(file: FileNode) {
    if (file.isFolder) {
      this.currentPath.push(file.name);
      this.currentFolderFiles = this.currentFolderContent();
      this.updateActiveFolder();
    }
  }

  goBack(): void {
    this.currentPath.pop();
    this.currentFolderFiles = this.currentFolderContent();
    this.updateActiveFolder();
  }

  private updateActiveFolder(): void {
    this.unsetActiveFolder();

    if (this.currentPath.length === 0) {
      return;
    }

    // Set active for the current folder
    const findAndUpdateActiveFolder = (currentFolder: FileNode[], path: string[]): void => {
        if (path.length === 0) {
        return;
      }

      const folderName = path[0];
      const subFolder = currentFolder?.find(node => node.name === folderName && node.isFolder);

      if (subFolder) {
        path.shift();

        if (path.length === 0) {
          subFolder.active = true;
          subFolder.expanded = true;
          return;
        }
        findAndUpdateActiveFolder(subFolder.children || [], path);
        subFolder.expanded = true;
      }
    }

    let currentFolder: FileNode[] = this.dataSource.data;
    let path: string[] = [...this.currentPath];
    findAndUpdateActiveFolder(currentFolder, path);
  }

  private unsetActiveFolder(): void {
    const traverseTree = (node: FileNode): void => {
      node.active = false;
      if (node.children) {
        node.children.forEach(child => traverseTree(child));
      }
    }

    // Unset active for all nodes
    this.dataSource.data?.forEach(root => traverseTree(root));
  }

  toggleTreeNode(node: FileNode, e: MouseEvent): void {
    if (e.detail > 1) {
      return;
    }
    this.pendingTreeClick = setTimeout(() => {
      node.expanded = !node.expanded;
    }, 200);
  }

  openTreeNode(node: FileNode): void {
    clearTimeout(this.pendingTreeClick);

    node.expanded = !node.expanded;
    this.unsetActiveFolder();
    this.currentPath = [];
    node.active = true;

    const traverseFindActive = (node: FileNode): boolean => {
      if (node.active) {
        this.currentPath.unshift(node.name);
        return true;
      }
      if (node.children) {
        for (let i = 0; i < node.children.length; i++) {
          let child = node.children[i];
          if (traverseFindActive(child)) {
            this.currentPath.unshift(node.name);
            return true;
          }
        }
      }
      return false;
    }

    // find the active node
    this.dataSource.data.forEach(root => traverseFindActive(root));
    this.currentFolderFiles = this.currentFolderContent();
    this.updateActiveFolder();
  }

  toggleView() {
    this.viewMode = this.viewMode === VIEW_MODE.MODULE ? VIEW_MODE.LIST : VIEW_MODE.MODULE;
    localStorage.setItem('fileManagerViewMode', this.viewMode);
  }

  private initDropzone(): void {
    let dropzone = document.querySelector('.file-manager-dropzone');
    let dndArea = dropzone?.querySelector('.dnd-area');

    dropzone?.addEventListener('dragenter', this.onDragenter.bind(this), false)
    dndArea?.addEventListener('dragover', this.onDragover.bind(this), false)
    dndArea?.addEventListener('dragleave', this.onDragleave.bind(this), false)
    dndArea?.addEventListener('drop', this.onDrop.bind(this), false)
  }

  private onDragenter(event: Event): void {
    event.preventDefault();
    let dropzone = document.querySelector('.file-manager-dropzone');
    dropzone?.classList.add('fileover');
  }

  private onDragover(event: Event): void {
    event.preventDefault();
  }

  private onDragleave(event: Event): void {
    event.preventDefault();
    let dropzone = document.querySelector('.file-manager-dropzone');
    dropzone?.classList.remove('fileover');
  }

  private onDrop(event: Event): void {
    event.preventDefault();
    let dropzone = document.querySelector('.file-manager-dropzone');
    dropzone?.classList.remove('fileover');

    const files = (event as DragEvent).dataTransfer?.files;
    this.uploadFiles(files);
  }

  fileBrowseHandler(target: any) {
    this.uploadFiles(target.files);
  }

  closeUploading() {
    this.showUploading = false;
  }

  deleteFromUploading(index: number) {
    if (index >= 0 && index < this.uploadingFiles.length) {
      const dt = new DataTransfer();
      for (let i = 0; i < this.uploadingFiles.length; i++) {
        if (i !== index) {
          dt.items.add(this.uploadingFiles[i]);
        }
      }
      this.uploadingFiles = dt.files as any;
    }
  }

  private uploadFiles(files: any) {
    this.showUploading = true;
    this.uploadingFiles = files;
    let currentIndex = 0;

    const readFile = (index: number) => {
      if (index < this.uploadingFiles.length) {
        const fileReader = new FileReader();
        this.uploadingFiles[index].uploadingStarted = true;

        fileReader.onload = async (event) => {
          await this.s3Service.uploadObject(
            this.type,
            this.generateObjectUrl(this.uploadingFiles[index].name),
            event?.target?.result as ArrayBuffer,
            () => {
              this.uploadingFiles[index].progress = 0;
            },
            (progressDelta: number) => {
              this.uploadingFiles[index].progress += progressDelta;
            },
            () => {
              this.uploadingFiles[index].progress = 100;
              this.uploadingFiles[index].uploadingCompleted = true;
              this.alertService.success(`The ${this.uploadingFiles[index].name} successfully uploaded to the cloud`);
            },
            () => {
              this.uploadingFiles[index].uploadingError = true;
            }
          );
          readFile(index + 1);
        };

        fileReader.readAsArrayBuffer(this.uploadingFiles[index]);
      } else {
        this.refresh(this.currentPath);
        this.showUploading = false;
      }
    };

    readFile(currentIndex);
  }

  private generateObjectUrl(fileName: string): string {
    const currentPath = this.currentPath.slice(1).join('/');
    return currentPath.length > 0
      ? currentPath + '/' + fileName
      : fileName;
  }

  createFolderDialog(): void {
    const dialogRef = this.dialog.open(CreateFolderDialog, {
      data: {
        type: this.type,
        baseUrl: this.generateObjectUrl('')
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh(this.currentPath);
      }
    });
  }

  isKeySet(): boolean {
    return this.cryptoService.isKeySet() && this.type === FileManagerType.PersonalVault;
  }

  async generateKey() {
    await this.cryptoService.generateKey();
    await this.refresh();
  }

  async onKeyFileSelected(target: any) {
    if (target.files.length > 0) {
      await this.cryptoService.selectKeyFromFile(target.files[0]);
      await this.refresh();
    }
  }
}

@Component({
  selector: 'create-folder-dialog',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Create New Folder</h2>
    <mat-dialog-content class="mat-typography">
      <mat-form-field [color]="themeColorService.getPrimaryColor()">
        <mat-label>Folder Name</mat-label>
        <input matInput [(ngModel)]="folderName">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button (click)="create()" [color]="themeColorService.getPrimaryColor()">Create</button>
    </mat-dialog-actions>
  `
})
export class CreateFolderDialog {
  folderName: string = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { type: FileManagerType, baseUrl: string },
    public dialogRef: MatDialogRef<CreateFolderDialog>,
    public themeColorService: ThemeColorService,
    private s3Service: S3Service,
    private alertService: AlertService,
  ) {}

  async create() {
    const res = await this.s3Service.createFolder(this.data.type, this.data.baseUrl + this.folderName);
    if (res) {
      this.alertService.success(`The folder ${this.folderName} successfully created`);
    }
    this.dialogRef.close(true);
  }
}