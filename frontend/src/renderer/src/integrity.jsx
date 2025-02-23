import React, { useState, useEffect } from "react";
import crypto from "crypto-js";

const API_BASE_URL = "http://localhost:8000";

const FileIntegrity = () => {
    const [files, setFiles] = useState([]);
    const [fileHashes, setFileHashes] = useState({});

    // Fetch stored files from backend
    const fetchFiles = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/getAllFiles`);
            const data = await response.json();
            setFiles(data.files);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    // Generate SHA-256 hash for a file
    const generateFileHash = async (file) => {
        console.log("Generating a hash for = " + file)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const wordArray = crypto.lib.WordArray.create(reader.result);
                const hash = crypto.SHA256(wordArray).toString();
                resolve(hash);
            };
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    };

    // Handle file upload
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const hash = await generateFileHash(file);
            setFileHashes((prev) => ({ ...prev, [file.name]: hash }));

            const formData = new FormData();
            formData.append("file", file);
            formData.append("hash", hash);

            const response = await fetch(`${API_BASE_URL}/uploadFile`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                fetchFiles();
            } else {
                console.error("Upload failed:", data.error);
            }
        } catch (error) {
            console.error("Error generating hash:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            for (const file of files) {
                if (fileHashes[file.path]) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/checkIntegrity`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ filename: file.path, hash: fileHashes[file.path] }),
                        });

                        const data = await response.json();
                        setFiles((prevFiles) =>
                            prevFiles.map((f) =>
                                f.path === file.path ? { ...f, integrity: data.integrity } : f
                            )
                        );
                    } catch (error) {
                        console.error("Error checking integrity:", error);
                    }
                }
            }
        }, 5000); 

        return () => clearInterval(interval);
    }, [files, fileHashes]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">File Integrity Checker</h2>
            <input type="file" onChange={handleFileUpload} className="mb-4 p-2 border rounded" />

            <table className="w-full border-collapse border border-gray-400">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-400 p-2">Filename</th>
                        <th className="border border-gray-400 p-2">Stored Hash</th>
                        <th className="border border-gray-400 p-2">Integrity Status</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr key={file.id} className="text-center">
                            <td className="border border-gray-400 p-2">{file.path}</td>
                            <td className="border border-gray-400 p-2">{file.hash}</td>
                            <td
                                className={`border border-gray-400 p-2 font-bold ${
                                    file.integrity === "OK" ? "text-green-500" : "text-red-500"
                                }`}
                            >
                                {file.integrity}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FileIntegrity;
