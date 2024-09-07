import { h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { PeerIdContext } from "../components/peerIdContext";
import PeerIdDisplay from "../components/peerIdDisplay";
import ConnectForm from "../components/connectForm";
import InstructionsLayout from "../components/instructionsLayout"; // שימוש בקומפוננטת ההוראות
import Invitation from "../components/invitation";

// הוראות ספציפיות לעמוד ShareSecurely
const secureChatInstructions = [
    { step: 1, color: 'bg-blue-500', title: 'Send Invite', description: 'Send an invite to your peer to start a secure chat session.' },
    { step: 2, color: 'bg-green-500', title: 'Connect', description: 'Enter the peer ID of your contact and connect securely.' },
    { step: 3, color: 'bg-yellow-500', title: 'Chat Securely', description: 'Start chatting securely and send encrypted files.' },
    { step: 4, color: 'bg-red-500', title: 'Recalculate Keys', description: 'Recalculate your encryption keys regularly for added security.' },
];

export default function ShareSecurely() {
    const { peerId } = useContext(PeerIdContext);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

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

                {/* שימוש בקומפוננטת InstructionsLayout עבור ההוראות */}
                <InstructionsLayout title="How Secure Chat Works" steps={secureChatInstructions} />
            </div>

            {isInviteOpen && (
                <Invitation close={toggleInviteModal} />
            )}
        </div>
    );
}
