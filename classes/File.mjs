export default class File {
    constructor({ name, size = 0, blocks = [] }) {
        this.name = name;
        this.size = size;
        this.blocks = blocks;
    }
}
