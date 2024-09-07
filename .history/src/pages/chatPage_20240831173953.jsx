import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatLayout from "../components/chatLayout";
import ChatMessages from "../components/chatMessages";
import MessageInput from "../components/messageInput";
import InstructionsLayout from "../components/instructionsLayout"; 

export default function ChatPage({ connectPeerId }) {
    return (
        <ChatLayout connectPeerId={connectPeerId}>
            <div className="flex flex-col md:flex-row">
                {/* שימוש בקומפוננטת InstructionsLayout */}
                <InstructionsLayout title="How Secure Chat Works">
                    <div className="text-gray-600 dark:text-gray-400">
                        <div className="mb-4">Enter peer ID and click 'Connect'.</div>
                        <div className="mb-4">Type and send your message.</div>
                        <div className="mb-4">Click paperclip to select a file.</div>
                        <div>Click 'Encrypt & Send' to send file.</div>
                    </div>
                </InstructionsLayout>

                <div className="w-full md:w-3/4 md:pl-4">
                    <ChatMessages />
                    <MessageInput />
                </div>
            </div>
            <ToastContainer />
        </ChatLayout>
    );
}
