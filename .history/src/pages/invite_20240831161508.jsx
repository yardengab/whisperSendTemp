import { h } from "preact";
import { useEffect, useContext, useState } from "preact/hooks";
import { PeerIdContext } from "../components/peerIdContext";
import { route } from "preact-router";
import { toast } from "react-toastify";

export default function Invite({ connectPeerId }) {
    const { peerId, connectToPeer, peer, setRecipientPeerId } = useContext(PeerIdContext);
    const [isConnecting, setIsConnecting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (peer && connectPeerId) {
            setIsConnecting(true);
            setRecipientPeerId(connectPeerId);

            connectToPeer(connectPeerId)
                .then(() => {
                    // ההתחברות ממתינה לאישור מהצד השני
                    toast.info("Awaiting approval from the other peer...");
                })
                .catch((err) => {
                    setIsConnecting(false);
                    setErrorMessage("Connection failed: " + err.message);
                });
        }
    }, [peer, connectPeerId, connectToPeer, setRecipientPeerId]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105 mb-8">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">
                    Connecting to Peer
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    Attempting to connect to peer: <strong>{connectPeerId}</strong>
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                    {isConnecting ? "Connecting..." : "Not Connected"}
                </p>
                {errorMessage && (
                    <p className="mt-6 text-red-500 text-lg font-semibold">
                        {errorMessage}
                    </p>
                )}
            </div>
        </div>
    );
}
