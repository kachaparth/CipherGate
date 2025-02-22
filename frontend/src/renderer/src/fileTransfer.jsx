import React, { useState } from 'react';
import { Upload } from 'lucide-react';

function FileTransfer() {
    const [files, setFiles] = useState([]);
    const [mode, setMode] = useState(''); // 'sender' or 'receiver'

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles(uploadedFiles); // Overwrite previous files
    };

    const handleFolderUpload = (event) => {
        const uploadedFolder = Array.from(event.target.files);
        if (uploadedFolder.length > 0) {
            setFiles([{ name: uploadedFolder[0].webkitRelativePath.split('/')[0] }]); // Show only folder name
        }
    };

    return (
        <>
            <div className="p-8 w-6xl flex flex-col items-center justify-center min-h-screen bg-gradient-to-br h-auto">
                {mode === '' ? (
                    <div className="flex space-x-48">
                        <button
                            onClick={() => setMode('sender')}
                            className="px-22 py-10 bg-blue-500 text-white text-3xl rounded-3xl shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-110 cursor-pointer"
                        >
                            Sender
                        </button>
                        <button
                            onClick={() => setMode('receiver')}
                            className="px-20 py-4 bg-green-500 text-white text-3xl rounded-3xl shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 cursor-pointer"
                        >
                            Receiver
                        </button>
                    </div>
                ) : (
                    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl">
                        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800">
                            {mode === 'sender' ? 'Send Files' : 'Receive Files'}
                        </h1>

                        {mode === 'sender' && (
                            <div className="mb-6 flex space-x-4">
                                <label className="border p-3 rounded-lg w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200">
                                    <Upload className="mr-2 text-blue-500" />
                                    <span className="text-gray-700">Choose File</span>
                                    <input
                                        type="file"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>

                                <label className="border p-3 rounded-lg w-1/2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center cursor-pointer bg-gray-100 hover:bg-gray-200">
                                    <Upload className="mr-2 text-green-500" />
                                    <span className="text-gray-700">Choose Folder</span>
                                    <input
                                        type="file"
                                        onChange={handleFolderUpload}
                                        webkitdirectory="true"
                                        directory="true"
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        )}

                        {files.length > 0 && mode === 'sender' && (
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold mb-4 text-gray-700">Files to be Sent:</h2>
                                <ul className="list-disc pl-6 text-gray-600">
                                    {files.map((file, index) => (
                                        <li key={index} className="py-1">{file.name}</li>
                                    ))}
                                </ul>
                                <button
                                    className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
                                >
                                    Send
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => { setMode(''); setFiles([]); }}
                            className="mt-8 px-6 py-3 bg-gray-500 cursor-pointer text-white rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default FileTransfer;
