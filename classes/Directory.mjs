export default class Directory {
    constructor({ subDirectories = [], files = [] } = {}) {
        this.subDirectories = subDirectories;
        this.files = files;
    }

    addFile(file) {
        this.files.push(file);
    }
    addDirectory() {}
    displayContent() {}

    getFile(name) {
        if (this.checkIfFileExist(name)) {
            return this.files.find((file) => file.name === name);
        }
        throw Error('This file does not exist!');
    }

    removeFile(name) {
        if (this.checkIfFileExist(name)) {
            this.files.splice(this.getFileIndex(name), 1);
        } else throw Error('This file does not exist!');
    }

    // HELPERS
    checkIfFileExist(name) {
        return this.getFileIndex(name) !== -1;
    }
    getFileIndex(name) {
        return this.files.findIndex((file) => file.name === name);
    }
    checkIfDirectoryExist() {}
}
