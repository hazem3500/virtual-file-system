import keyFileStorage from 'key-file-storage';
import promiseWhile from './helpers/promiseWhile';
import {
    queryCommands,
    queryDirectory,
    queryDirectoryAndSize,
    queryAllocationType
} from './helpers/queries';

import FileSystem from './classes/FileSystem';

const kfs = keyFileStorage('./');

let exitApplication = false;

async function run() {
    let fileSystem;
    if (!kfs.fileSystem) {
        const { allocationType } = await queryAllocationType();
        fileSystem = new FileSystem({ allocationType });
    } else {
        fileSystem = new FileSystem(JSON.parse(kfs.fileSystem));
    }

    promiseWhile(
        () => !exitApplication,
        () =>
            queryCommands().then(async (answers) => {
                switch (answers.command) {
                case 'createFile':
                    {
                        const {
                            directory,
                            size
                        } = await queryDirectoryAndSize();
                        fileSystem.createFile(directory, size);
                    }
                    break;
                case 'createFolder':
                    {
                        const { directory } = await queryDirectory();
                        fileSystem.createFolder(directory);
                    }
                    break;
                case 'deleteFile':
                    {
                        const { directory } = await queryDirectory();
                        fileSystem.deleteFile(directory);
                    }
                    break;
                case 'deleteFolder':
                    {
                        const { directory } = await queryDirectory();
                        fileSystem.deleteFolder(directory);
                    }
                    break;
                case 'displayDiskStatus':
                    fileSystem.displayDiskStatus();
                    break;
                case 'displayDiskStructure':
                    fileSystem.displayDiskStructure();
                    break;
                case 'exit':
                    exitApplication = true;
                    kfs.fileSystem = JSON.stringify(fileSystem);
                    process.exit(0);
                    break;
                default:
                }
            })
    );
}

run();
