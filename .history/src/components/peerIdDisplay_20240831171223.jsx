import { h } from "preact";
import { useState, useContext, useEffect } from "preact/hooks";
import { FaSyncAlt, FaShareAlt, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import { PeerIdContext } from "../components/peerIdContext";

export default function PeerIdDisplay({
    handleInvite,
    handleCopyPeerId,
    customStyle,
    title,
    showIcons,
}) {
    const { peerId, recalculatePeerId } = useContext(PeerIdContext);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // נקודת השבירה במסך
            if (window.innerWidth >= 768) {
                setIsExpanded(true); // במסכים גדולים להציג הכל כברירת מחדל
            } else {
                setIsExpanded(false); // במסכים קטנים להתחיל במצב Hide
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={`flex flex-col items-center mb-4 ${customStyle}`}>
            <div className="flex items-center space-x-2 mb-4">
                <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                    {title || "My Peer ID"}
                </p>
            </div>

            <div className="flex items-center justify-between bg-gray-700 text-white px-2 py-1 rounded-lg w-full max-w-full">
                <div className="flex-1 overflow-x-auto whitespace-nowrap mr-2">
                    <span className="text-xs font-bold">{peerId}</span>
                </div>

                {isSmallScreen && isExpanded && (
                    <button
                        onClick={toggleExpand}
                        className="focus:outline-none flex items-center space-x-1"
                    >
                        <FaEyeSlash />
                        <span>Hide</span>
                    </button>
                )}

                {isSmallScreen && !isExpanded && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleExpand}
                            className="focus:outline-none flex items-center space-x-1"
                        >
                            <FaEye />
                            <span>Show</span>
                        </button>

                        {showIcons && (
                            <>
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
                                    <FaCopy className="w-4 h-4 text-white cursor-pointer" />
                                </button>
                                <button
                                    className="focus:outline-none"
                                    onClick={handleInvite}
                                >
                                    <FaShareAlt className="w-4 h-4 text-white cursor-pointer" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
