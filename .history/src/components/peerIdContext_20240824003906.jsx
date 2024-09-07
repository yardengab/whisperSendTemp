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
    const [initiatedDisconnect, setInitiatedDisconnect] = useState(false); // משתנה לזיהוי יזמת ההתנתקות

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
                            handleData(data, con.peer); 
                        });
                        con.on("close", () => {
                            if (!initiatedDisconnect) {
                                handleRemoteDisconnect(); // כשהצד השני מתנתק, שואלים את המשתמש אם הוא רוצה להתנתק
                            }
                        });
                    } else {
                        con.close();
                    }
                });
        });
    }, [peer, initiatedDisconnect]);

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
                handleData(data, recId);
            });
            con.on("close", () => {
                if (!initiatedDisconnect) {
                    handleRemoteDisconnect(); // כשהצד השני מתנתק, שואלים את המשתמש אם הוא רוצה להתנתק
                }
            });
        });
    };

    const disconnect = (initiatedByUser = false) => {
        if (initiatedByUser) {
            setInitiatedDisconnect(true); // סימון שהיוזמה היא של המשתמש
        }
    
        if (initiatedDisconnect) return; // מונע קריאה כפולה להתנתקות
    
        if (connection) {
            connection.send(JSON.stringify({ type: "disconnect" }));
            connection.close();
        }
        setIsDisconnected(true); 
        setConnection(null);
        setRecipient("");
        setRecipientPeerId("");
        setMessages([]);
        setMessage("");
        route('/shareSecurely');
    };
    

    const handleRemoteDisconnect = () => {
        console.log("handleRemoteDisconnect");
        openConfirmModal("Remote Disconnect", "The other user has disconnected. Do you want to disconnect as well?").then((confirmed) => {
            if (confirmed) {
                disconnect(); // ניתוק והפנייה ל-sharesecurly אם המשתמש רוצה להתנתק
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
                console.log("handleData");
                handleRemoteDisconnect();
            } else if (parsedData.messageType === "file") {
                handleReceiveFile(
                    messages,
                    setMessages,
                    myWallet.privateKey,
                    senderPeerId, 
                    parsedData,
                    openConfirmModal
                );
            } else if (parsedData.messageType === "text") {
                handleReceiveMessage(
                    setMessages,
                    myWallet.privateKey,
                    senderPeerId, 
                    data
                );
            } else {
                console.log("Unknown messageType received");
            }
        } catch (error) {
            handleReceiveMessage(
                setMessages,
                myWallet.privateKey,
                senderPeerId, 
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
