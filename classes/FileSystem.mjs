import path from 'path';

import Directory from './Directory';
import File from './File';
import allocationStrategy, {
    getFreeSpace,
    getAllocatedSpace
} from '../helpers/allocationMethods';

export default class FileSystem {
    constructor({ root, allocationType, blocks = Array(500).fill(false) }) {
        this.root = new Directory(root);
        this.allocationType = allocationType;
        this.blocks = blocks;
        this.allocationMethods = allocationStrategy(allocationType);
    }

    createFile(directory, size) {
        const { dir, base } = path.parse(directory);
        const parentDirectory = dir
            ? this.root.getDirectory(...dir.split('/'))
            : this.root;
        const newFile = new File({ name: base, size });
        this.allocationMethods.allocate(this.blocks, newFile);
        parentDirectory.addFile(newFile);
    }
    deleteFile(directory) {
        const { dir, base } = path.parse(directory);
        const parentDirectory = dir
            ? this.root.getDirectory(...dir.split('/'))
            : this.root;
        const deleteFile = parentDirectory.getFile(base);
        this.allocationMethods.deallocate(this.blocks, deleteFile);
        parentDirectory.removeFile(base);
    }
    createFolder(directory) {
        const { dir, base } = path.parse(directory);
        const parentDirectory = dir
            ? this.root.getDirectory(...dir.split('/'))
            : this.root;
        parentDirectory.addDirectory(base);
    }
    deleteFolder(directory) {
        const { dir, base } = path.parse(directory);
        const parentDirectory = dir
            ? this.root.getDirectory(...dir.split('/'))
            : this.root;
        const deletedDirectory = parentDirectory.getSubDirectory(base);
        const allFiles = deletedDirectory.getAllFiles(
            [],
            ...deletedDirectory.subDirectories
        );
        allFiles.forEach((file) => {
            this.allocationMethods.deallocate(this.blocks, file);
        });
        parentDirectory.deleteDirectory(base);
    }
    displayDiskStatus() {
        const emptySpaces = getFreeSpace(this.blocks);
        const allocatedSpaces = getAllocatedSpace(this.blocks);
        const emptySpaceSize = emptySpaces.reduce(
            (size, emptySpace) => size + emptySpace.size,
            0
        );
        const allocatedSpaceSize = allocatedSpaces.reduce(
            (size, allocatedSpace) => size + allocatedSpace.size,
            0
        );
        console.log(
            JSON.stringify(
                {
                    emptySpaceSize,
                    allocatedSpaceSize,
                    emptySpaces,
                    allocatedSpaces
                },
                null,
                2
            )
        );
    }
    displayDiskStructure() {
        console.log(JSON.stringify(this.root, null, 2));
    }
}
