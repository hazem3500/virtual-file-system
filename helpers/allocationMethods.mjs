const contiguous = {
    allocate(blocks, file) {
        const largestSpace = getLargestEmptySpace(blocks);
        if (largestSpace.size < file.size) throw Error('Out of memory!');
        file.blocks.push({ start: largestSpace.start, size: file.size });
        this.setSpaceValue(
            blocks,
            { start: largestSpace.start, size: file.size },
            true
        );
    },
    deallocate(blocks, file) {
        if (!file.blocks) throw Error('File not allocated!');
        this.setSpaceValue(blocks, file.blocks[0], false);
    },

    setSpaceValue(blocks, { start, size }, value) {
        for (let i = start; i < start + size; i++) {
            blocks[i] = value;
        }
    }
};

const linked = {
    allocate(blocks, file) {},
    deallocate(blocks, file) {},
    setSpaceValue(blocks, { start, size }, value) {}
};

export default function allocationStrategy(allocationType) {
    if (allocationType === 'contiguous') {
        return contiguous;
    }
    if (allocationType === 'linked') {
        return linked;
    }
    if (allocationType === 'indexed') {
        return {
            allocate: null,
            deallocate: null,
            setSpaceValue: null
        };
    }
}
function getFreeSpace(blocks) {
    let startOfEmptyBlock;
    return blocks.reduce((freeSpaces, block, i, blocks) => {
        // first block in free space
        if (!block && startOfEmptyBlock === undefined) {
            startOfEmptyBlock = i;
        }
        // first non-empty block after free space
        else if (block && !blocks[i - 1] && i !== 0) {
            freeSpaces.push({
                start: startOfEmptyBlock,
                size: i - startOfEmptyBlock
            });
            startOfEmptyBlock = undefined;
            return freeSpaces;
        }
        // last empty block
        else if (!block && i === blocks.length - 1) {
            freeSpaces.push({
                start: startOfEmptyBlock,
                size: i + 1 - startOfEmptyBlock
            });
            return freeSpaces;
        }
        return freeSpaces;
    }, []);
}

function getLargestEmptySpace(blocks) {
    return getFreeSpace(blocks).reduce(
        (largestFreeSpace, currFreeSpace) => {
            if (currFreeSpace.size > largestFreeSpace.size) {
                return currFreeSpace;
            }
            return largestFreeSpace;
        },
        { size: 0 }
    );
}
