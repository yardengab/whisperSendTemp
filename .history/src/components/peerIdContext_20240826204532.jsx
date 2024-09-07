import { createContext } from "preact";
import { useState, useEffect } from "preact/hooks";
import Peer from "peerjs";
import { handleReceiveMessage, handleReceiveFile } from "../utils/chatActions";
import { peerConfig } from "../utils/config";
import { ethers } from "ethers"; // ייבוא ספריית ethers
import ConfirmModal from "../utils/confirmModal"; // ייבוא המודאל לאישור

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
    const [showConfirmModal, setShowConfirmModal] = useState(false); // מודאל אישור
    const [confirmCallback, setConfirmCallback] = useState(null);
    const [confirmModalData, setConfirmModalData] = useState({
        title: "",
        message: "",
    });
    const [isDisconnected, setIsDisconnected] = useState(false);

    useEffect(() => {
        const newWallet = ethers.Wallet.createRandom();
        const { publicKey, privateKey } = newWallet;
        setMyWallet(newWallet);
        setPeerId(publicKey); // Set the peer ID
    }, []);

    useEffect(() => {
        if (!myWallet) return;

        const pr = new Peer(myWallet.publicKey, peerConfig);
        setPeer(pr);
        return () => {
            pr.destroy();
        };
    }, [myWallet]);

    useEffect(() => {
        if (!peer) return;

        peer.on("connection", (con) => {
            console.log("Connection received");
            con.on("open", () => {
                console.log("Connected");
                setRecipient(con.peer);
                setRecipientPeerId(con.peer);
                setConnection(con);
            });
        });
    }, [peer]);

    useEffect(() => {
        if (!connection) return;

        connection.on("data", function (data) {
            handleData(data);
        });
        connection.on("close", () => {
            disconnect();
        });
        connection.on("error", (err) => {
            console.error("Connection error:", err);
        });
    }, [connection]);

    const connectRecipient = (e) => {
        e.preventDefault();
        if (connection) {
            disconnect();
        } else {
            connectToPeer(recipient);
            setRecipientPeerId(recipient);
        }
    };

    const connectToPeer = (recId) => {
        const con = peer.connect(recId);
        setConnection(con);
        setRecipientPeerId(recId);
        console.log("Connection established - sender");

        con.on("open", () => {
            setConnection(con);
        });

        con.on("data", function (data) {
            handleData(data);
        });

        con.on("close", () => {
            disconnect();
        });

        con.on("error", (err) => {
            console.error("Connection error:", err);
        });
    };

    const disconnect = (initiatedByUser = false) => {
        if (initiatedByUser && connection) {
            connection.send(JSON.stringify({ type: "disconnect" }));
        }

        if (connection) {
            connection.close();
        }

        setConnection(null);
        setRecipient("");
        setRecipientPeerId("");
        setMessages([]);
        setMessage("");

        if (initiatedByUser) {
            route("/shareSecurely");
        }
    };

    const handleRemoteDisconnect = () => {
        openConfirmModal(
            "Peer Disconnected",
            "The other user has disconnected. Do you want to leave the chat as well?"
        ).then((confirmed) => {
            if (confirmed) {
                disconnect(); // ניתוק והפנייה ל-shareSecurely אם המשתמש רוצה להתנתק
                route("/shareSecurely");
            } else {
                setIsDisconnected(true); // השבתת האפשרות לשלוח הודעות
            }
        });
    };

    const handleData = (data) => {
        try {
            const parsedData = JSON.parse(data);

            if (parsedData.type === "disconnect") {
                handleRemoteDisconnect();
            } else if (parsedData.messageType === "file") {
                handleReceiveFile(
                    messages,
                    setMessages,
                    myWallet.privateKey,
                    recipientPeerId,
                    parsedData
                );
            } else if (parsedData.messageType === "text") {
                handleReceiveMessage(
                    setMessages,
                    myWallet.privateKey,
                    recipientPeerId,
                    data
                );
            } else {
                console.log("Unknown messageType received in handleData");
            }
        } catch (error) {
            console.log("Text received that is not JSON in handleData");
            handleReceiveMessage(
                setMessages,
                myWallet.privateKey,
                recipientPeerId,
                data
            );
        }
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

    return (
        <PeerIdContext.Provider
            value={{
                peer,
                connectToPeer,
                connectRecipient,
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
                isDisconnected,
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
