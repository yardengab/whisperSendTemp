import { createContext } from "preact";
import { useState, useEffect } from "preact/hooks";
import Peer from "peerjs";
import { handleReceiveMessage, handleReceiveFile } from "../utils/chatActions";
import { peerConfig } from "../utils/config";
import { ethers } from "ethers";
import ConfirmModal from "../components/ConfirmModal";
import { route } from "preact-router";

export const PeerIdContext = createContext();

export const PeerIdProvider = ({ children }) => {
    const [peer, setPeer] = useState(null);
    const [connection, setConnection] = useState(null);
    const [recipient, setRecipient] = useState("");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [myWallet, setMyWallet] = useState(null);
    const [recipientPeerId, setRecipientPeerId] = useState("");
    const [peerId, setPeerId] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [confirmModalData, setConfirmModalData] = useState({ title: "", message: "" });
    const [isDisconnected, setIsDisconnected] = useState(false);

    useEffect(() => {
        const newWallet = ethers.Wallet.createRandom();
        const { publicKey } = newWallet;
        setMyWallet(newWallet);
        setPeerId(publicKey);
        console.log("Wallet created with public key:", publicKey);
    }, []);

    useEffect(() => {
        if (!myWallet) return;

        const pr = new Peer(myWallet.publicKey, peerConfig);
        setPeer(pr);
        console.log("Peer created with ID:", myWallet.publicKey);

        return () => {
            pr.destroy();
            console.log("Peer destroyed");
        };
    }, [myWallet]);

    useEffect(() => {
        if (!peer) return;

        peer.on("connection", (con) => {
            console.log("Connection received from peer:", con.peer);
            setRecipientPeerId(con.peer);
            openConfirmModal("Incoming Connection", `Do you want to accept the connection request from ${con.peer}?`)
                .then((accepted) => {
                    if (accepted) {
                        setConnection(con);
                        setRecipient(con.peer);
                        route(`/chat/${con.peer}`);
                        con.on("data", function (data) {
                            handleData(data, con.peer); // העברת המפתח הציבורי עם ההודעה
                        });
                        con.on("close", () => {
                            handleRemoteDisconnect(); // כאשר המשתמש המרוחק מתנתק
                        });
                    } else {
                        con.close();
                    }
                });
        });
    }, [peer]);

    const connectToPeer = (recId) => {
        return new Promise((resolve, reject) => {
            const con = peer.connect(recId);
            con.on("open", () => {
                setConnection(con);
                setRecipientPeerId(recId);
                resolve();
                route(`/chat/${recId}`);
            });
            con.on("error", (err) => {
                console.error("Connection error:", err);
                reject(err);
            });
            con.on("data", function (data) {
                handleData(data, recId); // העברת המפתח הציבורי עם ההודעה
            });
            con.on("close", () => {
                handleRemoteDisconnect(); // כאשר המשתמש המרוחק מתנתק
            });
        });
    };

    const disconnect = () => {
        if (connection) {
            connection.send(JSON.stringify({ type: "disconnect" })); // שליחת הודעת ניתוק
            connection.close();
            setConnection(null);
        }
        setRecipient("");
        setRecipientPeerId("");
        setMessages([]);
        setMessage("");
        setIsDisconnected(true);
    };

    const handleRemoteDisconnect = () => {
        openConfirmModal("Remote Disconnect", "The other user has disconnected. Do you want to disconnect as well?")
            .then((accepted) => {
                if (accepted) {
                    disconnect();
                    route('/sharesecurly');
                } else {
                    setIsDisconnected(true);
                }
            });
    };

    const openConfirmModal = (title, message) => {
        return new Promise((resolve) => {
            setConfirmCallback(() => resolve);
            setConfirmModalData({ title, message });
            setShowConfirmModal(true);
        });
    };

    const closeConfirmModal = (confirmed) => {
        setShowConfirmModal(false);

        if (confirmCallback) {
            confirmCallback(confirmed);
        }
    };

    const handleData = (data, senderPeerId) => {
        try {
            const parsedData = JSON.parse(data);

            if (parsedData.type === "disconnect") {
                handleRemoteDisconnect(); // כאשר מתקבלת הודעת ניתוק
                return;
            }

            if (parsedData.messageType === "file") {
                handleReceiveFile(
                    messages,
                    setMessages,
                    myWallet.privateKey,
                    senderPeerId, // העברת המפתח הציבורי של השולח
                    parsedData,
                    openConfirmModal
                );
            } else if (parsedData.messageType === "text") {
                handleReceiveMessage(
                    setMessages,
                    myWallet.privateKey,
                    senderPeerId, // העברת המפתח הציבורי של השולח
                    data
                );
            } else {
                console.log("Unknown messageType received");
            }
        } catch (error) {
            handleReceiveMessage(
                setMessages,
                myWallet.privateKey,
                senderPeerId, // העברת המפתח הציבורי של השולח
                data
            );
        }
    };

    return (
        <PeerIdContext.Provider
            value={{
                peer,
                connectToPeer,
                disconnect,
                connection,
                recipient,
                setRecipient,
                messages,
                setMessages,
                message,
                setMessage,
                myWallet,
                peerId,
                recipientPeerId,
                setRecipientPeerId,
                openConfirmModal,
                isDisconnected // משתנה חדש שמצביע על ניתוק
            }}
        >
            {children}
            {showConfirmModal && (
                <ConfirmModal
                    title={confirmModalData.title}
                    message={confirmModalData.message}
                    onConfirm={() => closeConfirmModal(true)}
                    onCancel={() => closeConfirmModal(false)}
                />
            )}
        </PeerIdContext.Provider>
    );
};
