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
            <div className="flex flex-col md:flex-row">
                <InstructionsLayout title="How Secure Chat Works" steps={chatInstructions} />
                
                <div className="w-full md:w-3/4 md:pl-4">
                    <ChatMessages />
                    <MessageInput />
                </div>
            </div>
            <ToastContainer />
        </ChatLayout>
    );
}
