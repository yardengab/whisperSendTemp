import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatLayout from "../components/chatLayout";
import ChatMessages from "../components/chatMessages";
import MessageInput from "../components/messageInput";
import InstructionsLayout from "../components/instructionsLayout";

const chatInstructions = [
    { step: 1, color: 'blue', title: 'Connect', description: "Enter peer ID and click 'Connect'." },
    { step: 2, color: 'green', title: 'Message', description: 'Type and send your message.' },
    { step: 3, color: 'yellow', title: 'Send File', description: 'Click paperclip to select a file.' },
    { step: 4, color: 'red', title: 'Encrypt', description: "Click 'Encrypt & Send' to send file." },
    { step: 5, color: 'purple', title: 'Decrypt', description: "Click 'Decrypt' to view received file." },
];

export default function ChatPage({ connectPeerId }) {
    return (
        <ChatLayout connectPeerId={connectPeerId}>
            {/* קונטיינר מרכזי */}
            <div className="w-full max-w-7xl">
                {/* קונטיינר הצ'אט */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full h-full transform transition duration-500 hover:scale-105 mb-8 flex flex-col">
                    <ChatMessages className="flex-grow" />
                    <MessageInput />
                </div>

                {/* קונטיינר ההוראות */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full h-full transform transition duration-500 hover:scale-105 mb-8">
                    <InstructionsLayout title="How Secure Chat Works" steps={chatInstructions} />
                </div>
            </div>

            <ToastContainer />
        </ChatLayout>
    );
}
