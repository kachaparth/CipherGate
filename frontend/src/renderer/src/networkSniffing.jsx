import React, { useState, useEffect } from 'react';
import { Mail, PlayCircle } from 'lucide-react';

function NetworkSniffing() {
    const [email, setEmail] = useState('');
    const [isSessionActive, setIsSessionActive] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleStartSession = () => {
        if (email.trim() !== '') {
            alert(`Session started for parent: ${email}`);
            setIsSessionActive(true);
        } else {
            alert('Please enter a valid parent email.');
        }
    };

    return (
        <div className="p-0 w-full flex flex-col items-center justify-center h-screen bg-gradient-to-br  overflow-hidden box-border">
            <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl">
                <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
                    Parental Control - Network Sniffing
                </h1>

                <div className="mb-6 flex flex-col space-y-4">
                    <label className="border p-3 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center justify-center bg-gray-100 hover:bg-gray-200">
                        <Mail className="mr-2 text-blue-500" />
                        <input
                            type="email"
                            placeholder="Enter Parent's Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent outline-none"
                        />
                    </label>
                </div>

                <button
                    onClick={handleStartSession}
                    className="mt-4 px-8 py-4 bg-green-500 text-white text-2xl rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105 flex items-center justify-center"
                >
                    <PlayCircle className="mr-2" /> Start Session
                </button>

                {isSessionActive && (
                    <p className="mt-8 text-lg text-green-600 font-semibold text-center">
                        Session is active for {email}
                    </p>
                )}
            </div>
        </div>
    );
}

export default NetworkSniffing;
