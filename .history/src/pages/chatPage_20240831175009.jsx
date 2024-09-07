import { h } from "preact";
import { useState } from "preact/hooks";
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
    const [isExpanded, setIsExpanded] = useState(false);
    const isSmallScreen = window.innerWidth < 768;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            {/* Peer ID של המשתמש הנוכחי */}
            <div className="w-full max-w-7xl mb-4">
                <PeerIdDisplay 
                    title="My Peer ID" 
                    showIcons={!isSmallScreen || isExpanded}
                />
            </div>

            <div className="w-full max-w-7xl flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl mb-4">
                <div className="flex items-center space-x-2 truncate">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                        Chatting with peer:
                    </p>

                    {/* הצגת Peer ID בהתאם לגודל המסך והמצב המורחב */}
                    <span
                        className={`text-xs font-bold bg-gray-700 text-white px-2 py-1 rounded-lg ${isSmallScreen && !isExpanded ? 'truncate' : ''}`}
                        style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: isSmallScreen && !isExpanded ? "150px" : "100%",
                        }}
                    >
                        {connectPeerId}
                    </span>

                    {isSmallScreen && (
                        <button
                            onClick={toggleExpand}
                            className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-lg"
                        >
                            {isExpanded ? "Hide" : "Show"}
                        </button>
                    )}
                </div>

                <button
                    onClick={() => disconnect()}  // Placeholder for the disconnect function
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                >
                    Disconnect
                </button>
            </div>

            <div className="w-full max-w-4xl">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105 mb-8">
                    <ChatMessages />
                    <MessageInput />
                </div>

                {/* כאן ההוראות יופיעו בריבוע נפרד מתחת לצ'אט */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105 mb-8">
                    <InstructionsLayout title="How Secure Chat Works" steps={chatInstructions} />
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}
