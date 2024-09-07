import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import ChatMessages from "../components/chatMessages";
import MessageInput from "../components/messageInput";
import InstructionsLayout from "../components/instructionsLayout";
import PeerIdDisplay from "../components/peerIdDisplay";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const chatInstructions = [
    { step: 1, color: 'blue', title: 'Connect', description: "Enter peer ID and click 'Connect'." },
    { step: 2, color: 'green', title: 'Message', description: 'Type and send your message.' },
    { step: 3, color: 'yellow', title: 'Send File', description: 'Click paperclip to select a file.' },
    { step: 4, color: 'red', title: 'Encrypt', description: "Click 'Encrypt & Send' to send file." },
    { step: 5, color: 'purple', title: 'Decrypt', description: "Click 'Decrypt' to view received file." },
];

export default function ChatPage({ connectPeerId }) {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);
    const [showMyPeerId, setShowMyPeerId] = useState(false);
    const [showChatPeer, setShowChatPeer] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            {/* Peer ID של המשתמש הנוכחי */}
            <div className="w-full max-w-7xl mb-4">
                <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                        My Peer ID
                    </span>
                    <button
                        onClick={() => setShowMyPeerId(!showMyPeerId)}
                        className="flex items-center text-sm text-white font-bold"
                    >
                        <i className="fa fa-eye mr-1"></i> {/* האייקון של העין */}
                        {showMyPeerId ? "Hide My Peer ID" : "Show My Peer ID"}
                    </button>
                </div>
                {showMyPeerId && (
                    <PeerIdDisplay
                        title=""
                        showIcons={!isSmallScreen}
                        peerId="0x123...abc" // ה-Peer ID שלך
                    />
                )}
            </div>

            {/* Peer ID של השיחה */}
            <div className="w-full max-w-7xl mb-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowChatPeer(!showChatPeer)}
                        className="flex items-center text-sm text-white font-bold"
                    >
                        <i className="fa fa-eye mr-1"></i> {/* האייקון של העין */}
                        {showChatPeer ? "Hide Chat Peer" : "Show Chat Peer"}
                    </button>
                    <button
                        onClick={() => console.log("Disconnect")} // פונקציה לניתוק
                        className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                    >
                        Disconnect
                    </button>
                </div>
                {showChatPeer && (
                    <div className="mt-2 text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-white">
                        {connectPeerId}
                    </div>
                )}
            </div>

            <div className="w-full max-w-4xl">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105 mb-8">
                    <ChatMessages />
                    <MessageInput />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105 mb-8">
                    <InstructionsLayout title="How Secure Chat Works" steps={chatInstructions} />
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}
