export default class File {
    constructor({ name, size = 0, block = [] }) {
        this.name = name;
        this.size = size;
        this.blocks = block;
    }
}
