import { useState } from "preact/hooks";

export default function MnemonicPopup({ mnemonic, onConfirm }) {
    const [isMnemonicConfirmed, setIsMnemonicConfirmed] = useState(false);

    const handleDownloadMnemonic = () => {
        const blob = new Blob([mnemonic], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "mnemonic.txt";
        link.click();
    };

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Mnemonic Words</h2>
                <p className="mb-4">
                    Please save the following mnemonic phrase. You will need it to decrypt your files.
                </p>
                <div className="bg-gray-200 p-4 rounded mb-4">
                    {mnemonic}
                </div>
                <div className="mb-4">
                    <button
                        onClick={handleDownloadMnemonic}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
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
                    onClick={() =>
                        isMnemonicConfirmed
                            ? onConfirm()
                            : alert("Please confirm that you saved the mnemonic.")
                    }
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}
