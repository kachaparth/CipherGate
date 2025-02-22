import React, { useState } from 'react';
import { FiFolder } from 'react-icons/fi';

function Integrity() {
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleFileSelection = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setSelectedFiles(uploadedFiles);
    };

    const uploadFilesToServer = async () => {
        setUploading(true);
        const uploaded = [];

        for (const file of selectedFiles) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch("http://localhost:8000/uploadFile", {
                    method: "POST",
                    body: formData,
                });
                const data = await response.json();
                console.log("Upload Response:", data);
                if (!data.error) {
                    uploaded.push({
                        name: file.name,
                        hash: data.hash
                    });
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }

        setFiles((prevFiles) => [...prevFiles, ...uploaded]);
        setSelectedFiles([]); // Clear selected files after upload
        setUploading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg w-6xl shadow-lg max-w-3xl mx-auto font-sans">
            <h1 className="text-xl font-bold mb-6 text-gray-800">
                {files.length === 0 ? "Enter the file you want to check!" : "Files uploaded for checking:"}
            </h1>

            <div className="mb-4 text-center">
                <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700">
                    <FiFolder className="text-3xl" />
                    <span className="text-lg">Select file(s)</span>
                </label>
                <input 
                    type="file" 
                    id="file-upload" 
                    onChange={handleFileSelection} 
                    multiple 
                    className="hidden"
                />
            </div>

            {selectedFiles.length > 0 && (
                <div className="text-center text-gray-600 mb-4">
                    Selected files: {selectedFiles.map(f => f.name).join(", ")}
                </div>
            )}

            {/* Upload Button */}
            <div className="text-center mb-6">
                <button 
                    onClick={uploadFilesToServer} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    disabled={uploading || selectedFiles.length === 0}
                >
                    {uploading ? "Uploading..." : "Upload File"}
                </button>
            </div>

            {files.length === 0 ? (
                <div className="bg-gray-100 p-4 border-dashed border-2 border-gray-300 rounded text-center text-gray-600">
                    No files uploaded.
                </div>
            ) : (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Uploaded Files:</h2>
                    <ul className="list-none p-0">
                        {files.map((file, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="mr-2">{index + 1}. {file.name}</span>
                                <span className="text-sm text-gray-500">
                                    Hash: {file.hash.substring(0, 10)}...
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Integrity;
