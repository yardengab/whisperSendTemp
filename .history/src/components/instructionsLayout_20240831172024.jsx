import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function InstructionsLayout({ title, steps }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsExpanded(true);
            } else {
                setIsExpanded(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-4xl transform transition duration-500 hover:scale-105 mb-8">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {title}
                </h3>
                {isSmallScreen && (
                    <button
                        onClick={toggleExpand}
                        className="focus:outline-none flex items-center space-x-1"
                    >
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
            </div>
            {(isExpanded || !isSmallScreen) && (
                <div className="mt-4">
                    <div className="space-y-4">
                        {steps.map(({ step, color, title, description }) => (
                            <div key={step} className="flex items-center space-x-2">
                                <div className={`step-circle ${color}`}>
                                    <span className="text-white font-bold text-xl">
                                        {step}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                        {title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
