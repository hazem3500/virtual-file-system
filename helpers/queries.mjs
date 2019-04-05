import inquirer from 'inquirer';

export function queryCommands() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'command',
            message: 'choose: ',
            choices: [
                { name: 'Create file', value: 'createFile' },
                { name: 'Create folder', value: 'createFolder' },
                { name: 'Delete file', value: 'deleteFile' },
                { name: 'Delete folder', value: 'deleteFolder' },
                { name: 'Display disk status', value: 'displayDiskStatus' },
                {
                    name: 'Display disk structure',
                    value: 'displayDiskStructure'
                },
                { name: 'Exit', value: 'exit' }
            ]
        }
    ]);
}

export function queryDirectory() {
    return inquirer.prompt([
        {
            name: 'directory',
            message: 'Enter Directory: '
        }
    ]);
}

export function queryDirectoryAndSize() {
    return inquirer.prompt([
        {
            name: 'directory',
            message: 'Enter Directory: '
        },
        {
            type: 'number',
            name: 'size',
            message: 'Enter file size: '
        }
    ]);
}

export function queryAllocationType() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'allocationType',
            message: 'choose: ',
            choices: [
                { name: 'Contiguous Allocation', value: 'contiguous' },
                { name: 'Linked Allocation', value: 'linked' },
                { name: 'Indexed Allocation', value: 'indexed' }
            ]
        }
    ]);
}

export default { queryDirectory, queryDirectoryAndSize };
