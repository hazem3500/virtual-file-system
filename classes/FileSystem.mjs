import Directory from './Directory';
import File from './File';

export default class FileSystem {
    constructor({ root = new Directory() }) {
        this.root = root;
    }

    createFile(directory, size) {}
    createFolder(directory) {}
    deleteFile(directory) {}
    deleteFolder(directory) {}
    displayDiskStatus() {}
    displayDiskStructure() {}

    // HELPERS
}
