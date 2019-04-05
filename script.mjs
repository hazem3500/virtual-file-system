import inquirer from 'inquirer';
import keyFileStorage from 'key-file-storage';
import promiseWhile from './helpers/promiseWhile';
import { queryDirectory, queryDirectoryAndSize } from './helpers/queries';

import FileSystem from './classes/FileSystem';

const kfs = keyFileStorage('./');

const fileSystem = new FileSystem({ root: kfs.root || undefined });

const options = [
    {
        type: 'list',
        name: 'option',
        message: 'choose: ',
        choices: [
            { name: 'Create file', value: 'createFile' },
            { name: 'Create folder', value: 'createFolder' },
            { name: 'Delete file', value: 'deleteFile' },
            { name: 'Delete folder', value: 'deleteFolder' },
            { name: 'Display disk status', value: 'displayDiskStatus' },
            { name: 'Display disk structure', value: 'displayDiskStructure' },
            { name: 'Exit', value: 'exit' }
        ]
    }
];

let exitApplication = false;

promiseWhile(
    () => !exitApplication,
    () =>
        inquirer.prompt(options).then(async (answers) => {
            switch (answers.option) {
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
                kfs.root = JSON.stringify(fileSystem.root);
                process.exit(0);
                break;
            default:
            }
        })
);
