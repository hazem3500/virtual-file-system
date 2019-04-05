import inquirer from 'inquirer';

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

export default { queryDirectory, queryDirectoryAndSize };
