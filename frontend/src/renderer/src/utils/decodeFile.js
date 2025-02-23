export default function decodeFile(base64Data, fileName, mimeType) {
    const base64String = base64Data.split(',')[1];
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new File([byteArray], fileName, { type: mimeType });
}