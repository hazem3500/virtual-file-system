import FileSystem from '../classes/FileSystem.mjs';

const contiguous = {
    allocate(blocks, file) {
        const largestSpace = getLargestEmptySpace(blocks);
        if (largestSpace.size < file.size) throw Error('Out of memory!');
        file.blocks.push({ start: largestSpace.start, size: file.size });
        setSpaceValue(
            blocks,
            { start: largestSpace.start, size: file.size },
            true
        );
    },
    deallocate(blocks, file) {
        if (!file.blocks) throw Error('File not allocated!');
        setSpaceValue(blocks, file.blocks[0], false);
    }
};

const linked = {
    allocate(blocks, file) {
        const freeSpace = getFreeSpace(blocks);
        const freeSpaceLeft = freeSpace.reduce(
            (size, space) => size + space.size,
            0
        );
        if (freeSpaceLeft < file.size) throw Error('Out of memory!');

        const allocatedSpaces = [];
        let remainingFileSize = file.size;

        for (let i = 0; i < freeSpace.length; i++) {
            if (freeSpace[i].size < remainingFileSize) {
                addAllocatedSpace({
                    start: freeSpace[i].start,
                    size: freeSpace[i].size,
                    nextSpace: null
                });
                remainingFileSize -= freeSpace[i].size;
            } else {
                addAllocatedSpace({
                    start: freeSpace[i].start,
                    size: remainingFileSize,
                    nextSpace: null
                });
                break;
            }
        }

        file.blocks.push({
            start: allocatedSpaces[0].start,
            end: allocatedSpaces[allocatedSpaces.length - 1].start
        });

        allocatedSpaces.forEach((allocatedSpace) => {
            setSpaceValue(blocks, allocatedSpace, true, {
                size: allocatedSpace.size,
                nextSpace: allocatedSpace.nextSpace
            });
        });

        function addAllocatedSpace(space) {
            if (allocatedSpaces.length) {
                allocatedSpaces[allocatedSpaces.length - 1].nextSpace =
                    space.start;
            }
            allocatedSpaces.push(space);
        }
    },

    deallocate(blocks, file) {
        if (!file.blocks) throw Error('File not allocated!');

        let currIndex = file.blocks[0].start;
        let currAllocatedSpace = blocks[currIndex];
        do {
            setSpaceValue(
                blocks,
                { start: currIndex, size: currAllocatedSpace.size },
                false
            );
            if (currAllocatedSpace.nextSpace) {
                currIndex = currAllocatedSpace.nextSpace;
                currAllocatedSpace = blocks[currIndex];
            } else {
                currIndex = null;
            }
        } while (currIndex);
    }
};

const indexed = {
    allocate(blocks, file) {},
    deallocate(blocks, file) {}
};

export default function allocationStrategy(allocationType) {
    if (allocationType === 'contiguous') {
        return contiguous;
    }
    if (allocationType === 'linked') {
        return linked;
    }
    if (allocationType === 'indexed') {
        return indexed;
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

function setSpaceValue(blocks, { start, size }, value, nextSpacePointer) {
    for (let i = start; i < start + size; i++) {
        if (i === start && nextSpacePointer) blocks[i] = nextSpacePointer;
        else blocks[i] = value;
    }
}
