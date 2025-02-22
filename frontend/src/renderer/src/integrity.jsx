import React, { useState } from 'react';

function Integrity() {
    const [files, setFiles] = useState([]);

    const handleFileUpload = (event) => {
        const uploadedFiles = Array.from(event.target.files);
        setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Enter the file you want to check!</h1>
            <div className="mb-4">
                <input type="file" onChange={handleFileUpload} multiple className="border p-2 rounded" />
            </div>

            {files.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Files currently under checking:</h2>
                    <ul className="list-disc pl-5">
                        {files.map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Integrity;
