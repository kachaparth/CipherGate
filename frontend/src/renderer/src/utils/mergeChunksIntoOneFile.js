export default function mergeChunksIntoOneFile(decodedFiles, filename){
    const mergedBlob = new Blob(decodedFiles.map(chunk => chunk), {
        type: decodedFiles[0].type
    });
    const mergedFile = new File([mergedBlob], filename, {
        type: decodedFiles[0].type
    })
    return mergedFile;
}