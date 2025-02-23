import React, { useEffect, useState } from 'react';
import { FiUpload, FiFile } from 'react-icons/fi';
import createChunks from "./utils/createChunks.js";
import createFileFromBlob from "./utils/createFileFromBlob.js";
import encodeFile from "./utils/encodeFile.js";
import decodeFile from "./utils/decodeFile.js";
import mergeChunksIntoOneFile from "./utils/mergeChunksIntoOneFile.js";

const BACKEND_URL = "https://cloudbin-backend.onrender.com";

function CloudUpload() {
    const [file, setFile] = useState(null);
    const [allFiles, setAllFiles] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        fetch(`${BACKEND_URL}/getAllFiles`)
            .then((res) => res.json())
            .then((data) => setAllFiles(data.data))
            .catch((err) => console.error("Error fetching files:", err));
    }, []);

    async function handleUpload() {
        if (!file) return alert("Please select a file to upload.");

        const fileName = file.name;
        const chunkSize = 20;
        const chunks = createChunks(file, chunkSize);
        const chunkFiles = createFileFromBlob(chunks, fileName);

        for (let i = 0; i < chunkFiles.length; i++) {
            const encodedFile = await encodeFile(chunkFiles[i]);
            const payload = {
                fileName,
                fileType: file.type,
                lastModifiedDate: file.lastModifiedDate,
                fileSize: file.size,
                data: encodedFile,
            };

            try {
                const resp = await fetch(`${BACKEND_URL}/uploadFile`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: { "Content-Type": "application/json" },
                });
                if (!resp.ok) throw new Error(`Failed to upload chunk ${i + 1}`);

                setProgress(Math.round(((i + 1) / chunkFiles.length) * 100));
                console.log(`Chunk ${i + 1} uploaded successfully`);
            } catch (error) {
                console.error(`Error uploading chunk ${i + 1}:`, error);
            }
        }

        const res = await fetch(`${BACKEND_URL}/processFile`);
        res.json().then((data) => {
            alert(data.msg);
            setProgress(0);
            setFile(null);
        });
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto font-sans">
            <h1 className="text-xl font-bold mb-6 text-gray-800">Upload Files to Cloud</h1>

            <div className="mb-4 text-center">
                <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700">
                    <FiFile className="text-3xl" />
                    <span className="text-lg">Select File</span>
                </label>
                <input
                    type="file"
                    id="file-upload"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                />

                {file && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Selected File:</h2>
                        <p className="text-gray-700">{file.name}</p>
                        <button
                            onClick={handleUpload}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 mt-2"
                        >
                            Upload
                        </button>
                        {progress > 0 && (
                            <div className="mt-4">
                                <p>Uploading: {progress}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                    <div
                                        className="bg-blue-500 h-4 rounded-full"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {allFiles.length === 0 ? (
                <div className="bg-gray-100 p-4 border-dashed border-2 border-gray-300 rounded text-center text-gray-600">
                    No files uploaded.
                </div>
            ) : (
                <ul className="list-none p-0">
                    {allFiles.map((file, index) => (
                        <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span>{file.fileName} ({(file.fileSize / 10e5).toFixed(2)} MB)</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CloudUpload;
