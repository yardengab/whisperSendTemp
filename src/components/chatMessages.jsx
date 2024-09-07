import { useContext } from "preact/hooks";
import { PeerIdContext } from "./peerIdContext";

export default function ChatMessages() {
    const { messages, peerId } = useContext(PeerIdContext);

    const handleDownload = (msg) => {
        const link = document.createElement("a");
        link.href = msg.url;
        link.download = msg.content;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 overflow-y-auto mb-4"
             style={{ height: "70vh", width: "100%" }} // גובה הצ'אט 70vh כדי למנוע עלייה על שורת ההקלדה
        >
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`mb-2 p-2 rounded-lg ${msg.sender === peerId ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-gray-900 mr-auto"}`}
                    style={{
                        maxWidth: "75%",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                            {msg.sender === peerId ? "You" : "Peer"}
                        </span>
                        <span>
                            {msg.type === "text" ? (
                                msg.content
                            ) : (
                                <>
                                    <a
                                        href={msg.url}
                                        className="text-white underline"
                                        download={msg.content}
                                    >
                                        {msg.content}{" "}
                                        {msg.sender === peerId ? "(Sent)" : "(Received)"}
                                    </a>
                                    {msg.sender !== peerId && (
                                        <button
                                            onClick={() => handleDownload(msg)}
                                            className="ml-2 bg-green-500 text-white py-1 px-2 rounded"
                                        >
                                            Download
                                        </button>
                                    )}
                                </>
                            )}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
