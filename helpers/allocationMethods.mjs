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
export function getFreeSpace(blocks) {
    return getSpaces(blocks, false);
}

export function getAllocatedSpace(blocks) {
    return getSpaces(blocks, true);
}

function getSpaces(blocks, value) {
    let startOfBlock;
    return blocks.reduce((allocatedSpaces, block, i, blocks) => {
        if (block === value && startOfBlock === undefined) {
            startOfBlock = i;
        } else if (block !== value && blocks[i - 1] === value && i !== 0) {
            allocatedSpaces.push({
                start: startOfBlock,
                size: i - startOfBlock
            });
            startOfBlock = undefined;
            return allocatedSpaces;
        } else if (block === value && i === blocks.length - 1) {
            allocatedSpaces.push({
                start: startOfBlock,
                size: i + 1 - startOfBlock
            });
            return allocatedSpaces;
        }
        return allocatedSpaces;
    }, []);
}

export function getLargestEmptySpace(blocks) {
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
