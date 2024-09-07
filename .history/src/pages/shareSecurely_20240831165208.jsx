import { h } from "preact"; // ייבוא נכון מ־preact
import { useState, useContext } from "preact/hooks"; // ייבוא נכון מ־preact/hooks
import { PeerIdContext } from "../components/peerIdContext";
import PeerIdDisplay from "../components/peerIdDisplay";
import ConnectForm from "../components/connectForm";
import SecureChatInfo from "../components/secureChatInfo";
import Invitation from "../components/invitation"; // ייבוא של הקומפוננטה Invitation
import CollapsibleInstructions from "../components/collapsibleInstructions"; // ייבוא של הקומפוננטה החדשה

// דוגמה ל-steps שתעביר ל-CollapsibleInstructions
const steps = [
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105 mb-8">
                <PeerIdDisplay
                    handleInvite={toggleInviteModal} // פתיחת המודאל של Invitation
                    handleCopyPeerId={handleCopyPeerId}
                    customStyle="mb-4"
                    title="Secure Chat"
                    showIcons={true}
                />
                <ConnectForm />
            </div>
            
            {/* שימוש בקומפוננטת CollapsibleInstructions */}
            <CollapsibleInstructions steps={steps} />

            {isInviteOpen && (
                <Invitation close={toggleInviteModal} /> // קריאה ל-Invitation עם פונקציית סגירה
            )}
        </div>
    );
}
