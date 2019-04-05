import File from './File';

export default class Directory {
    constructor({ name = 'root', subDirectories = [], files = [] } = {}) {
        this.name = name;
        this.subDirectories = subDirectories.map(
            (subDirectory) => new Directory(subDirectory)
        );
        this.files = files.map((file) => new File(file));
    }

    addFile(file) {
        this.files.push(file);
    }

    getFile(name) {
        if (this.checkIfFileExist(name)) {
            return this.files.find((file) => file.name === name);
        }
        throw Error('This file does not exist!');
    }

    getAllFiles(files = [], currDirectoryName, ...subDirectories) {
        if (!currDirectoryName) return [...this.files, ...files];
        const currDirectory = this.getSubDirectory(currDirectoryName);
        files = [...files, ...currDirectory.files];
        return currDirectory.getAllFiles(files, ...subDirectories);
    }

    removeFile(name) {
        if (this.checkIfFileExist(name)) {
            this.files.splice(this.getFileIndex(name), 1);
        } else throw Error('This file does not exist!');
    }

    getDirectory(currDirectoryName, ...subDirectories) {
        const currDirectory = this.getSubDirectory(currDirectoryName);
        if (!subDirectories.length) return currDirectory;
        return currDirectory.getDirectory(...subDirectories);
    }

    addDirectory(name) {
        const newDirectory = new Directory({ name });
        this.subDirectories.push(newDirectory);
    }

    deleteDirectory(name) {
        this.subDirectories.splice(this.getSubDirectoryIndex(name), 1);
    }

    // HELPERS
    checkIfFileExist(name) {
        return this.getFileIndex(name) !== -1;
    }
    getFileIndex(name) {
        return this.files.findIndex((file) => file.name === name);
    }
    checkIfDirectoryExist() {}

    getSubDirectory(name) {
        return this.subDirectories[this.getSubDirectoryIndex(name)];
    }

    getSubDirectoryIndex(name) {
        const subDirectoryIndex = this.subDirectories.findIndex(
            (dir) => dir.name === name
        );
        if (subDirectoryIndex === -1) {
            throw Error('Directory does not exist!');
        }
        return subDirectoryIndex;
    }
}
