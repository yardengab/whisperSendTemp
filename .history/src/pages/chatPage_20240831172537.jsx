import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatInstruction from "../components/chatInstruction";
import ChatLayout from "../components/chatLayout";
import ChatMessages from "../components/chatMessages";
import MessageInput from "../components/messageInput";
import InstructionsLayout from "../components/instructionsLayout"; // ייבוא קומפוננטת ההוראות

// מערך ההוראות לדף הצ'אט
const chatInstructions = [
    { step: 1, color: 'bg-blue-500', title: 'Connect', description: "Enter peer ID and click 'Connect'." },
    { step: 2, color: 'bg-green-500', title: 'Message', description: 'Type and send your message.' },
    { step: 3, color: 'bg-yellow-500', title: 'Send File', description: 'Click paperclip to select a file.' },
    { step: 4, color: 'bg-red-500', title: 'Encrypt', description: "Click 'Encrypt & Send' to send file." },
    { step: 5, color: 'bg-purple-500', title: 'Decrypt', description: "Click 'Decrypt' to view received file." },
];

export default function ChatPage({ connectPeerId }) {
    return (
        <ChatLayout connectPeerId={connectPeerId}>
            <div className="flex flex-col-reverse md:flex-row">
                <div className="w-full md:w-3/4 pl-0 md:pl-4">
                    <ChatMessages />
                    <MessageInput />
                </div>

                {/* הצגת ההוראות מתחת לצ'אט במסכים קטנים, ומצד שמאל במסכים גדולים */}
                <InstructionsLayout title="How Secure Chat Works" steps={chatInstructions} />
            </div>
            <ToastContainer />
        </ChatLayout>
    );
}
