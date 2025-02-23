import React, { useState } from 'react';
import { FiUpload, FiFile } from 'react-icons/fi';

function CloudUpload() {
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleFileSelect = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setSelectedFiles(uploadedFiles.map(file => file.name));
    };

    const handleUpload = () => {
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        setSelectedFiles([]);
    };

    const handleDeleteFile = (fileToDelete) => {
        if (window.confirm(`Are you sure you want to delete "${fileToDelete}"?`)) {
            setFiles(files.filter(file => file !== fileToDelete));
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg w-6xl shadow-lg max-w-3xl mx-auto font-sans">
            <h1 className="text-xl font-bold mb-6 text-gray-800">Upload Files to Cloud</h1>

            <div className="mb-4 text-center">
                <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700">
                    <FiFile className="text-3xl" />
                    <span className="text-lg">Select Files</span>
                </label>
                <input
                    type="file"
                    id="file-upload"
                    onChange={handleFileSelect}
                    multiple
                    className="hidden"
                />

                {selectedFiles.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Selected Files:</h2>
                        <ul className="list-none p-0 mb-4">
                            {selectedFiles.map((file, index) => (
                                <li key={index} className="py-1 text-gray-700">{index + 1}. {file}</li>
                            ))}
                        </ul>
                        <button
                            onClick={handleUpload}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                        >
                            Upload
                        </button>
                    </div>
                )}
            </div>

            {files.length === 0 ? (
                <div className="bg-gray-100 p-4 border-dashed border-2 border-gray-300 rounded text-center text-gray-600">
                    No files uploaded.
                </div>
            ) : (
                <ul className="list-none p-0">
                    {files.map((file, index) => (
                        <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span>{index + 1}. {file}</span>
                            <div className="flex gap-2">
                                <button className="text-blue-500 hover:text-blue-700 text-sm cursor-pointer">Download</button>
                                <button
                                    onClick={() => handleDeleteFile(file)}
                                    className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CloudUpload;

