export default function encodeFile(file){
    return new Promise((resolve, reject)=> {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        }
        fileReader.onerror = () => {
            reject("Error occured");
        }
    }) 
}


