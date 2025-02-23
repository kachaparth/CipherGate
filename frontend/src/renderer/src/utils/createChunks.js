export default function createChunks(file, chuckSizeInMb){
    const chunkSize = chuckSizeInMb * 1e6;
    const chunkedBlobs = [];
    let start = 0;

    while (start < file.size) {
        let end = Math.min(start + chunkSize, file.size);
        chunkedBlobs.push(file.slice(start, end));
        start = end;
    }

    return chunkedBlobs;
}