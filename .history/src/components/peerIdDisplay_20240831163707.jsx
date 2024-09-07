import { h } from "preact";
import { useContext } from "preact/hooks";
import { FaSyncAlt, FaShareAlt } from "react-icons/fa";
import copyIcon from "../assets/copy.png";
import { PeerIdContext } from "../components/peerIdContext";

export default function PeerIdDisplay({
    handleInvite,
    handleCopyPeerId,
    customStyle,
    title,
    showIcons,
}) {
    const { peerId, recalculatePeerId } = useContext(PeerIdContext);

    return (
        <div className={`flex flex-col items-center mb-4 ${customStyle}`}>
            <div className="flex flex-col w-full items-center space-y-2">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    User's Peer ID:
                </p>
                <div className="flex items-center bg-gray-700 text-white px-2 py-1 rounded-lg w-full max-w-full overflow-hidden">
                    <span className="text-xs font-bold truncate max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
                        {peerId}
                    </span>
                    {showIcons && (
                        <div className="flex space-x-2 ml-2">
                            <button
                                className="focus:outline-none"
                                onClick={recalculatePeerId}
                            >
                                <FaSyncAlt className="w-4 h-4 text-yellow-500 cursor-pointer" />
                            </button>
                            <button
                                className="focus:outline-none"
                                onClick={handleCopyPeerId}
                            >
                                <img
                                    src={copyIcon}
                                    alt="Copy Icon"
                                    className="w-4 h-4 cursor-pointer"
                                />
                            </button>
                            <button
                                className="focus:outline-none"
                                onClick={handleInvite}
                            >
                                <FaShareAlt className="w-4 h-4 text-white cursor-pointer" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {title && (
                <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 mb-6 text-center">
                    {title}
                </h2>
            )}
        </div>
    );
}
