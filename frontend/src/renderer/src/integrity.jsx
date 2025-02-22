import React, { useState } from 'react';
import { FiFolder } from 'react-icons/fi'; // Importing a folder icon from react-icons

function Integrity() {
    const [files, setFiles] = useState([]);

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
    };

    const handleRemoveFile = (fileToRemove) => {
        setFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // You can customize the date format as needed
    };

    return (
        <div className="bg-white p-6 rounded-lg w-6xl shadow-lg max-w-3xl mx-auto font-sans">
            {/* Always show the title */}
            <h1 className="text-xl font-bold mb-6 text-gray-800">
                {files.length === 0 ? "Enter the file you want to check!" : "Files are being checked:"}
            </h1>

            <div className="mb-6 text-center">
                {/* Icon and text to trigger file selection */}
                <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2 text-gray-600 hover:text-gray-700">
                    <FiFolder className="text-3xl" />
                    <span className="text-lg">Enter file or select file</span>
                </label>
                <input 
                    type="file" 
                    id="file-upload" 
                    onChange={handleFileUpload} 
                    multiple 
                    className="hidden" // Hide the actual file input
                />
            </div>

            {/* Show an empty box if no file is selected */}
            {files.length === 0 ? (
                <div className="bg-gray-100 p-4 border-dashed border-2 border-gray-300 rounded text-center text-gray-600">
                    No files selected.
                </div>
            ) : (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Files currently under checking:</h2>
                    <ul className="list-none p-0">
                        {files.map((file, index) => (
                            <li key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                                {/* File name and Last modified date are justified */}
                                <div className="flex place-items-center justify-between w-full">
                                    <span className="mr-2">{index + 1}. {file.name}</span>
                                    <span className="text-sm text-gray-500">
                                        Last Modified: {formatDate(file.lastModified)}
                                    </span>
                                </div>

                                {/* Remove button */}
                                <button 
                                    onClick={() => handleRemoveFile(file)} 
                                    className="text-red-500 hover:text-red-700 text-sm ml-2 cursor-pointer"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Integrity;
