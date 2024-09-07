import { h } from "preact";
import { useContext, useState, useEffect } from "preact/hooks";
import { PeerIdContext } from "./peerIdContext";
import ConfirmModal from "../utils/confirmModal"; // ייבוא המודל

export default function ChatLayout({ peerId, connectPeerId, children, instructions }) {
    const { disconnect, showExitButton, handleExit } = useContext(PeerIdContext);
    const [showPeerModal, setShowPeerModal] = useState(false); // שליטה על מודל Peer IDs
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768); // מעקב אחרי גודל המסך

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // נקודת שבירה: מסכים קטנים מ-768px
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // בדיקה ראשונית לגודל המסך

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleDisconnect = () => {
        disconnect(true);
        route("/shareSecurely");
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center p-4 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">

            {/* הצגת Peer ID של השיחה רק במסכים גדולים */}
            {!isSmallScreen && (
                <div className="flex items-center justify-between w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl mb-4">
                    <div className="flex items-center space-x-2 truncate">
                        <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                            Peer ID you're chatting with:
                        </p>
                        <span
                            className="text-xs font-bold bg-gray-700 text-white px-2 py-1 rounded-lg"
                            style={{
                                whiteSpace: 'normal', // תמיכה בשבירת שורה
                                wordWrap: 'break-word', // שבירת מילים ארוכות
                                overflowWrap: 'break-word', // שבירת מילים כדי למנוע גלילה
                                maxWidth: '100%' // להבטיח שהטקסט לא יחרוג מהמקום המוקצה
                            }}
                        >
                            {connectPeerId}
                        </span>
                    </div>
                    <div className="flex space-x-2 ml-4">
                        {showExitButton ? (
                            <button
                                onClick={handleExit}
                                className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                            >
                                Exit
                            </button>
                        ) : (
                            <button
                                onClick={handleDisconnect}
                                className="text-sm bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                            >
                                Disconnect
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* כפתורי Disconnect ו-Show Peer Info במסכים קטנים בלבד */}
            {isSmallScreen && (
                <div className="flex items-center justify-center space-x-4 mb-4">
                    <button
                        onClick={handleDisconnect}
                        className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                    >
                        Disconnect
                    </button>
                    <button
                        className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-green-600 transition duration-300"
                        onClick={() => setShowPeerModal(true)}
                    >
                        Show Peer Info
                    </button>
                </div>
            )}

            {/* מודל להצגת Peer IDs */}
            {showPeerModal && (
                <ConfirmModal
                    title="Peer Information"
                    message={`Your Peer ID: ${peerId || "N/A"}\nPeer ID you're chatting with: ${connectPeerId}`}
                    onConfirm={() => setShowPeerModal(false)}
                    onCancel={() => setShowPeerModal(false)}
                />
            )}

            {/* חלון הצ'אט */}
            <div className="w-full flex-grow mb-4">
                <div className="w-full flex flex-col bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl overflow-hidden">
                    {children} {/* הצגת הודעות והכנסת הודעה חדשה */}
                </div>
            </div>

            {/* ההוראות מתחת לצ'אט */}
            {instructions && (
                <div className="w-full mt-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl">
                        {instructions}
                    </div>
                </div>
            )}
        </div>
    );
}
