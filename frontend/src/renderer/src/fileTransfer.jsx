import React, { useState } from 'react';

function fileTransfer() {
    const [files, setFiles] = useState([]);
    const [mode, setMode] = useState(''); // 'sender' or 'receiver'

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
    };

    return (
        <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-gradient-to-br">
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
                        className="px-20 py-4 bg-green-500 text-white text-3xl  rounded-3xl shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 cursor-pointer"
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
                        <div className="mb-6">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                multiple
                                className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
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
                        </div>
                    )}

                    <button
                        onClick={() => setMode('')}
                        className="mt-8 px-6 py-3 bg-gray-500 cursor-pointer text-white rounded-lg hover:bg-gray-600 transition-transform transform hover:scale-105"
                    >
                        Go Back
                    </button>
                </div>
            )}
        </div>
    );
}

export default Integrity;
