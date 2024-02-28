import {AfterViewInit, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeModule, MatTreeNestedDataSource } from "@angular/material/tree";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatIconModule, MatIconRegistry } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { DomSanitizer } from "@angular/platform-browser";
import { NgxFilesizeModule } from "ngx-filesize";
import { FileManagerType, FileNode, VIEW_MODE } from "@types";
import { AlertService, CognitoService, Theme, ThemeService } from "@globalShared";
import { S3Service } from "@services";

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [CommonModule, MatTreeModule, MatIconModule, MatButtonModule, MatTooltipModule, MatInputModule, MatCardModule, MatTableModule, NgxFilesizeModule],
  templateUrl: './file-manager.component.html',
  styleUrl: './file-manager.component.scss'
})
export class FileManagerComponent implements AfterViewInit {
  @Input() type: FileManagerType = FileManagerType.Storage;

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

  constructor(
    protected readonly themeService: ThemeService,
    private cognitoService: CognitoService,
    private s3Service: S3Service,
    private alertService: AlertService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    const fileIconMapping: { [key: string]: string } = {
      'pdf': 'pdf.svg',
      'doc': 'doc.svg',
      'docx': 'doc.svg',
      'xls': 'xls.svg',
      'xlsx': 'xls.svg',
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

  getType(object: FileNode): string {
    if (object.isFolder) {
      return 'Folder';
    }
    const parts = object.name.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  }
  getSvgIcon(object: FileNode): string {
    const icons = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'mp3', 'mp4', 'zip', 'rar', 'jpg', 'jpeg', 'png'];
    const fileType = this.getType(object);
    return icons.includes(fileType) ? fileType : 'file';
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

  private uploadFiles(files: any) {
    let currentIndex = 0;

    const readFile = (index: number) => {
      if (index < files.length) {
        const fileReader = new FileReader();

        fileReader.onload = async (event) => {
          const content = event?.target?.result as ArrayBuffer;
          const CHUNK_SIZE = 10 * 1024 * 1024;   // min chunk 10 MB
          const totalChunks = content?.byteLength > 0 ? content?.byteLength / CHUNK_SIZE : 1;
          const fileUrl = this.generateObjectUrl(files[index].name);
          const fileUniqueUrl = Math.random().toString(36).slice(-6) + fileUrl;
          const uploadedParts = []

          console.log('content: ', content);

          await this.s3Service.createMultipartUpload(this.type, fileUrl);

          for (let chunk = 0; chunk < totalChunks; chunk++) {
            let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE);
            const uploadedPart = await this.s3Service.uploadObjectPart(this.type, fileUniqueUrl, CHUNK, chunk + 1);
            uploadedParts.push(uploadedPart);
          }

          const res = await this.s3Service.completeMultipartUpload(this.type, fileUrl, uploadedParts);
          if (res) {
            this.alertService.success(`The ${files[index].name} successfully uploaded to the cloud`);
          }

          readFile(index + 1);
        };

        fileReader.readAsArrayBuffer(files[index]);
      } else {
        this.refresh(this.currentPath);
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
}
