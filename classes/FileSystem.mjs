import path from 'path';

import Directory from './Directory';
import File from './File';
import allocationStrategy from '../helpers/allocationMethods';

export default class FileSystem {
    constructor({ root, allocationType, blocks = Array(500).fill(false) }) {
        this.root = new Directory(root);
        this.allocationType = allocationType;
        this.blocks = blocks;
        this.allocationMethods = allocationStrategy(allocationType);
    }

    createFile(directory, size) {
        const { dir, base } = path.parse(directory);
        const newFile = new File({ name: base, size });
        this.allocationMethods.allocate(this.blocks, newFile);
        this.root.addFile(newFile);
    }
    deleteFile(directory) {
        const { dir, base } = path.parse(directory);
        const deleteFile = this.root.getFile(base);
        this.allocationMethods.deallocate(this.blocks, deleteFile);
        this.root.removeFile(base);
    }
    createFolder(directory) {}
    deleteFolder(directory) {}
    displayDiskStatus() {}
    displayDiskStructure() {
        console.log(this.root);
    }
}
