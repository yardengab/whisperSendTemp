import { h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { PeerIdContext } from "../components/peerIdContext";
import PeerIdDisplay from "../components/peerIdDisplay";
import ConnectForm from "../components/connectForm";
import SecureChatInfo from "../components/secureChatInfo";
import Invitation from "../components/invitation";

export default function ShareSecurely() {
    const { peerId } = useContext(PeerIdContext);
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const toggleInviteModal = () => {
        setIsInviteOpen(!isInviteOpen);
    };

    const handleCopyPeerId = () => {
        navigator.clipboard
            .writeText(peerId)
            .then(() => {
                alert("Peer ID copied to clipboard!");
            })
            .catch((err) => {
                console.error("Could not copy text: ", err);
            });
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // md breakpoint
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900">
            {/* הקונטיינר המשותף שגורם לשני הריבועים לשמור על אותו רוחב */}
            <div className="w-full max-w-4xl">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105 mb-8">
                    <PeerIdDisplay
                        handleInvite={toggleInviteModal}
                        handleCopyPeerId={handleCopyPeerId}
                        customStyle="mb-4"
                        title="Secure Chat"
                        showIcons={true}
                    />
                    <ConnectForm />
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105 mb-8">
                    {isSmallScreen && !showInstructions ? (
                        <button
                            onClick={() => setShowInstructions(true)}
                            className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                        >
                            Show Instructions
                        </button>
                    ) : (
                        <div>
                            <SecureChatInfo />
                            {isSmallScreen && (
                                <button
                                    onClick={() => setShowInstructions(false)}
                                    className="w-full px-4 py-2 mt-4 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                                >
                                    Hide Instructions
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isInviteOpen && (
                <Invitation close={toggleInviteModal} />
            )}
        </div>
    );
}
