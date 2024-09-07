import { useContext } from "preact/hooks";
import { FaPaperclip, FaSmile } from "react-icons/fa";
import { handleSendMessage, handleSendFile } from "../utils/chatActions";
import { PeerIdContext } from "../components/peerIdContext";
import { toast } from "react-toastify";

export default function MessageInput() {
    const {
        connection,
        messages,
        setMessages,
        message,
        setMessage,
        myWallet,
        peerId,
        recipientPeerId,
        openConfirmModal, 
        isDisconnected, // משתנה חדש כדי לבדוק אם המשתמש מנותק
    } = useContext(PeerIdContext);

    return (
        <div className="flex items-center space-x-4">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-3 rounded-lg bg-gray-200 dark:bg-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isDisconnected} // מניעת הקלדה כשהמשתמש מנותק
            />
            <FaPaperclip
                className={`w-6 h-6 text-gray-500 cursor-pointer ${isDisconnected ? 'cursor-not-allowed opacity-50' : ''}`}
                onClick={() => !isDisconnected && document.getElementById("fileInput").click()}
            />
            <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={(e) =>
                    !isDisconnected && handleSendFile({
                        e,
                        connection,
                        recipientPeerId,
                        myWallet,
                        peerId,
                        setMessages,
                        messages,
                        openConfirmModal, 
                    })
                }
            />
            <FaSmile className={`w-6 h-6 text-gray-500 cursor-pointer ${isDisconnected ? 'cursor-not-allowed opacity-50' : ''}`} />
            <button
                onClick={() => {
                    if (isDisconnected) {
                        toast.error("You are disconnected. Cannot send messages.");
                        return;
                    }
                    if (!connection) {
                        toast.error("Connection is not established yet. Please try again.");
                        return;
                    }
                    handleSendMessage({
                        message,
                        connection,
                        recipientPeerId,
                        messages,
                        myWallet,
                        peerId,
                        setMessages,
                        setMessage,
                    });
                }}
                className={`px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ${isDisconnected ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={isDisconnected} 
            >
                Send
            </button>
        </div>
    );
}
