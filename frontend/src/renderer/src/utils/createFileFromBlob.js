export default function createFileFromBlob(chunkedBlobs, filename){
    let chunkedFiles = [];
    let filenameWithOutExtension = filename.split('.')[0];
    let extension = filename.split('.')[1];
    chunkedBlobs.map((e, i) => {
        chunkedFiles.push(new File([e], filenameWithOutExtension + "-" + i + "." + extension));
    })
    return chunkedFiles;
}