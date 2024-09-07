import { h, Fragment } from "preact";
import { useState, useContext, useEffect, useRef } from "preact/hooks";
import { FaSyncAlt, FaShareAlt, FaEye, FaEyeSlash } from "react-icons/fa"; // אייקונים לפתיחה/סגירה
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
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const scrollContainerRef = useRef(null); // יצירת רפרנס לקונטיינר של ה-Peer ID

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleMouseDown = (e) => {
        const scrollContainer = scrollContainerRef.current;
        scrollContainer.isDown = true;
        scrollContainer.startX = e.pageX - scrollContainer.offsetLeft;
        scrollContainer.scrollLeft = scrollContainer.scrollLeft;
    };

    const handleMouseLeave = () => {
        scrollContainerRef.current.isDown = false;
    };

    const handleMouseUp = () => {
        scrollContainerRef.current.isDown = false;
    };

    const handleMouseMove = (e) => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer.isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - scrollContainer.startX) * 2; // הכפלת המרחק כדי להזיז מהר יותר
        scrollContainer.scrollLeft -= walk;
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 1024); // קובע אם המסך קטן מ-1024 פיקסלים
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // בדיקה ראשונית של גודל המסך

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
                {isSmallScreen && (
                    <button onClick={toggleExpand} className="focus:outline-none flex items-center space-x-1">
                        {isExpanded ? (
                            <>
                                <FaEyeSlash />
                                <span>Hide</span>
                            </>
                        ) : (
                            <>
                                <FaEye />
                                <span>Show</span>
                            </>
                        )}
                    </button>
                )}
                {(isExpanded || !isSmallScreen) && (
                    <div
                        className="flex-1 ml-2 overflow-x-hidden whitespace-nowrap cursor-pointer"
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        style={{ WebkitOverflowScrolling: "touch" }}
                    >
                        <span className="text-xs font-bold">
                            {peerId}
                        </span>
                    </div>
                )}
                <div className="flex space-x-2 ml-auto">
                    {showIcons && (
                        <Fragment>
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
                                    className="w-4 h-4 cursor-pointer" />
                            </button>
                            <button
                                className="focus:outline-none"
                                onClick={handleInvite}
                            >
                                <FaShareAlt className="w-4 h-4 text-white cursor-pointer" />
                            </button>
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}
