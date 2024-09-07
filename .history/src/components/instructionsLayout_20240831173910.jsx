import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

export default function InstructionsLayout({ title, children }) {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // נקודת השבירה
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // כדי להפעיל את ההגדרה בהתחלה

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full"> {/* נשמור את הרוחב של הריבוע לפי העיצוב המקורי */}
            {isSmallScreen && !showInstructions ? (
                <button
                    onClick={() => setShowInstructions(true)}
                    className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
                >
                    Show Instructions
                </button>
            ) : (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full transform transition duration-500 hover:scale-105">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                        {title}
                    </h3>
                    <div className="space-y-4">
                        {children} {/* מעבירים את התוכן כ-children */}
                    </div>
                    {isSmallScreen && (
                        <button
                            onClick={() => setShowInstructions(false)}
                            className="w-full px-4 py-2 mt-4 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 transition duration-300"
                        >
                            Hide Instructions
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
