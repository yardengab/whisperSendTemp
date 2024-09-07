import { h } from "preact";
import PeerIdDisplay from "./peerIdDisplay";
import { useContext } from "preact/hooks";
import { PeerIdContext } from "./peerIdContext";
import { route } from 'preact-router';

export default function ChatLayout({ peerId, connectPeerId, children }) {
    const { disconnect } = useContext(PeerIdContext);

    const handleDisconnect = () => {
        disconnect();
        // Redirect to the 'sharesecurly' page
        route('/shareSecurly');
    };

    return (
        <div className="min-h-screen flex flex-col items-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            <PeerIdDisplay
                peerId={peerId}
                customStyle=""
                title=""
                showIcons={false}
            />
            <div className="w-full max-w-7xl bg-white dark:bg-gray-800 p-4 rounded-xl shadow-2xl mb-8">
                <div className="flex justify-center items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                            You are chatting with peer:
                        </p>
                        <span className="text-2xl font-bold bg-gray-700 text-white px-4 py-2 rounded-lg">
                            {connectPeerId}
                        </span>
                    </div>
                    <button 
                        onClick={handleDisconnect} 
                        className="ml-4 text-sm bg-red-500 text-white px-3 py-1 rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                    >
                        Disconnect
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
