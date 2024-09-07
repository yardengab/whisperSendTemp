import { useEffect, useContext, useState } from "preact/hooks";
import { Buffer } from "buffer";
import { encryptFile } from "../utils/encryption";
import { PeerIdContext } from "../components/peerIdContext";
import ToggleInstructionsButton from "../components/ToggleInstructionsButton"; // כפתור הצגת/הסתרת ההוראות
import InstructionsLayout from "../components/InstructionsLayout";

export default function Encrypt() {
    const { myWallet } = useContext(PeerIdContext);
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [isMnemonicConfirmed, setIsMnemonicConfirmed] = useState(false);
    const [showMnemonicPopup, setShowMnemonicPopup] = useState(false);
    const [isEncrypted, setIsEncrypted] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false); // שליטה בהצגת ההוראות
    const [isSmallScreen, setIsSmallScreen] = useState(false); // גודל המסך

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768); // מעקב אחרי שינויי גודל המסך
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // קריאה ראשונה לבדיקת הגודל

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // בדיקה אם הפופ-אפ של ה-Mnemonic כבר אושר ושמור ב-sessionStorage
    useEffect(() => {
        const mnemonicShown = sessionStorage.getItem("mnemonicSaved");
        if (!mnemonicShown) {
            setShowMnemonicPopup(true); // מציגים את הפופ-אפ אם המנמוניק לא נשמר
        }
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage("");
        setIsEncrypted(false);
    };

    const handleDownloadMnemonic = () => {
        const blob = new Blob([myWallet.mnemonic.phrase], {
            type: "text/plain",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "mnemonic.txt";
        link.click();
    };

    const handleConfirmMnemonic = () => {
        if (isMnemonicConfirmed) {
            sessionStorage.setItem("mnemonicSaved", "true"); // נשמר ב-sessionStorage
            setShowMnemonicPopup(false); // הסתרת הפופ-אפ
        } else {
            alert("Please confirm that you have saved your mnemonic.");
        }
    };

    const handleEncrypt = async () => {
        if (!file) return;

        setMessage("Encrypting file, please wait...");

        const privateKey = myWallet.privateKey;
        const publicKey = myWallet.publicKey;

        const reader = new FileReader();
        reader.onload = () => {
            const fileBuffer = Buffer.from(reader.result);
            const encryptedData = encryptFile(fileBuffer, publicKey, privateKey);

            const blob = new Blob([JSON.stringify(encryptedData)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${file.name}.encrypted`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsEncrypted(true);
            setMessage("File encrypted successfully! The file is downloading now.");
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-800 dark:to-gray-900 relative">
            {/* קונטיינר להצפנה */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-5xl mx-auto mb-8">
                <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-6">
                    Self-Encryption
                </h2>
                {/* תוכן טופס הצפנה */}
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                        Choose a file:
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleEncrypt}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-900 transition duration-300"
                >
                    Encrypt & Save
                </button>
                {message && (
                    <p className="mt-6 text-green-500 text-lg font-semibold">
                        {message}
                    </p>
                )}
            </div>

            {/* כפתור להוראות - יופיע רק במסכים קטנים */}
            {isSmallScreen && (
                <ToggleInstructionsButton
                    showInstructions={showInstructions}
                    onClick={() => setShowInstructions(!showInstructions)}
                />
            )}

            {/* הוראות */}
            {(showInstructions || !isSmallScreen) && (
                <div className="w-full max-w-5xl mx-auto">
                    <InstructionsLayout
                        title="How Encryption Works"
                        steps={[
                            { step: 1, color: 'blue', title: 'Select a file', description: 'Choose a file to encrypt.' },
                            { step: 2, color: 'green', title: 'Encrypt', description: 'Click "Encrypt & Save" to encrypt the file.' },
                            { step: 3, color: 'yellow', title: 'Save file and keys', description: 'Download the encrypted file and the keys.' },
                            { step: 4, color: 'red', title: 'Store securely', description: 'Store the encryption keys securely.' },
                        ]}
                    />
                </div>
            )}

            {/* פופאפ ה-Mnemonic */}
            {showMnemonicPopup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-2xl font-bold mb-4">Mnemonic Words</h2>
                        <p className="mb-4">
                            Please save the following mnemonic phrase. You will need it to decrypt your files.
                        </p>
                        <div className="bg-gray-200 p-4 rounded mb-4">
                            {myWallet.mnemonic.phrase}
                        </div>
                        <div className="mb-4">
                            <button onClick={handleDownloadMnemonic} className="bg-blue-500 text-white px-4 py-2 rounded">
                                Download Mnemonic
                            </button>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="confirm"
                                className="mr-2"
                                checked={isMnemonicConfirmed}
                                onChange={() => setIsMnemonicConfirmed(!isMnemonicConfirmed)}
                            />
                            <label htmlFor="confirm" className="text-gray-700">
                                I have written down the mnemonic phrase
                            </label>
                        </div>
                        <button
                            onClick={handleConfirmMnemonic}
                            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
