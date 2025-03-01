import { toast } from "react-toastify";
import {
    encryptText,
    encryptFile,
    decryptText,
    decryptFile
} from "./encryption";
import sendSound from "../assets/whisper.mp3";
import { Buffer } from "buffer";

let encryptFileCounter = 1;

export const playSendSound = () => {
    const audio = new Audio(sendSound);
    audio.play();
};

export const handleSendMessage = ({
    message,
    connection,
    recipientPeerId,
    messages,
    myWallet,
    peerId,
    setMessages,
    setMessage
}) => {
    if (connection && connection.open) {
        const { encrypted, nonce } = encryptText(
            message,
            recipientPeerId,
            myWallet.privateKey
        );
        const encMessage = JSON.stringify({
            messageType: "text",
            encrypted,
            nonce
        });
        connection.send(encMessage);
        setMessages([
            ...messages,
            { sender: peerId, content: message, type: "text" }
        ]);
        setMessage("");
        playSendSound();
        toast.success("Message sent!");
    } else {
        console.error("Connection is not open, cannot send message.");
    }
};

export const handleSendFile = async ({
    e,
    connection,
    recipientPeerId,
    myWallet,
    peerId,
    setMessages,
    messages,
    openConfirmModal,
}) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        const confirmEncrypt = await openConfirmModal(
            "Encrypt File",
            "Do you want to encrypt the file before sending?"
        );
        const reader = new FileReader();
        reader.onload = async (event) => {
            const fileBuffer = Buffer.from(event.target.result);
            let encMessage;
            let fileName = selectedFile.name;

            if (confirmEncrypt) {
                const encryptedFileData = encryptFile(
                    fileBuffer,
                    recipientPeerId,
                    myWallet.privateKey
                );
                encMessage = JSON.stringify(encryptedFileData);
                fileName = `encrypted${encryptFileCounter++}${fileName.substring(
                    fileName.lastIndexOf(".")
                )}.txt`; 
            } else {
                encMessage = fileBuffer.toString("hex");
            }

            connection.send(
                JSON.stringify({
                    messageType: "file",
                    data: encMessage,
                    fileName
                })
            );

            const fileURL = URL.createObjectURL(
                new Blob([encMessage], {
                    type: confirmEncrypt ? "text/plain" : selectedFile.type
                })
            );

            const displayName = confirmEncrypt ? fileName : `${fileName} (Not Encrypted)`;

            setMessages([
                ...messages,
                {
                    sender: peerId,
                    content: displayName,
                    type: "file",
                    url: fileURL,
                    encrypted: confirmEncrypt
                }
            ]);
        };
        reader.readAsArrayBuffer(selectedFile);

        e.target.value = null;
    }
};

export const handleReceiveMessage = (
    setMessages,
    privateKey,
    senderPublicKey,
    data
) => {
    const decryptedMessage = decryptText(data, senderPublicKey, privateKey);
    if (decryptedMessage !== "error") {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: "Peer", content: decryptedMessage, type: "text" }
        ]);
    } else {
        console.error("Failed to decrypt message.");
    }
};

export const handleReceiveFile = async (
    messages,
    setMessages,
    privateKey,
    senderPublicKey,
    data,
    openConfirmModal
) => {
    let fileURL;
    let fileName = data.fileName;
    let encrypted = false;

    if (!fileName) {
        console.error("Received file without a valid name.");
        return;
    }

    if (typeof data.data === "string" && data.data.length % 2 === 0 && /^[0-9a-f]+$/i.test(data.data)) {
        const fileBuffer = Buffer.from(data.data, "hex");
        const blob = new Blob([fileBuffer], {
            type: "application/octet-stream"
        });
        fileURL = URL.createObjectURL(blob);
        toast.success("File received!");
    } else {
        const parsedData = JSON.parse(data.data);
        const { nonce, encrypted: encryptedData, type } = parsedData;

        const fileBuffer = Buffer.from(encryptedData, "hex");
        fileURL = URL.createObjectURL(
            new Blob([fileBuffer], { type: type || "application/octet-stream" })
        );
        encrypted = true;
        toast.success("Encrypted file received!");

        const shouldDecrypt = await openConfirmModal(
            "Decrypt File",
            "Do you want to decrypt the received file?"
        );

        if (shouldDecrypt) {
            const decryptedBlob = decryptFile(data.data, senderPublicKey, privateKey);
            if (decryptedBlob) {
                fileURL = URL.createObjectURL(decryptedBlob);
                fileName = fileName.replace("encrypted", "decrypted").replace(".txt", ""); 
                toast.success("File decrypted!");
            } else {
                console.error("File decryption failed.");
                return;
            }
        }
    }

    const fileAlreadyExists = messages.some(
        (msg) => msg.content === fileName && msg.type === "file"
    );
    if (!fileAlreadyExists) {
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender: "Peer",
                content: fileName,
                type: "file",
                url: fileURL,
                encrypted
            }
        ]);
    }
};
