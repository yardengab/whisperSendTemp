import { useState } from "preact/hooks";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // אייקונים לפתיחה/סגירה

export default function CollapsibleInstructions({ steps }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-full">
            <button
                onClick={toggleOpen}
                className="flex items-center justify-between w-full p-4 bg-blue-500 text-white font-bold rounded-lg shadow-lg"
            >
                <span>How Secure Chat Works</span>
                {isOpen ? (
                    <FaChevronUp className="w-4 h-4" />
                ) : (
                    <FaChevronDown className="w-4 h-4" />
                )}
            </button>
            {isOpen && (
                <div className="mt-4 space-y-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                    {steps.map(({ step, color, title, description }) => (
                        <div key={step} className="flex items-center space-x-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                                <span className="text-white font-bold text-xl">{step}</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">{title}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
