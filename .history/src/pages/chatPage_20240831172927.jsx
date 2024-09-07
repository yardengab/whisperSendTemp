import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChatLayout from "../components/chatLayout";
import ChatMessages from "../components/chatMessages";
import MessageInput from "../components/messageInput";
import InstructionsLayout from "../components/instructionsLayout"; // ייבוא הקומפוננטה החדשה

export default function ChatPage({ connectPeerId }) {
    return (
        <ChatLayout connectPeerId={connectPeerId}>
            <div className="flex flex-col md:flex-row">
                {/* שימוש בקומפוננטת InstructionsLayout עבור הוראות הצ'אט */}
                <InstructionsLayout title="How Secure Chat Works">
                    <ChatInstruction />
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
