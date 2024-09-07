import { h } from "preact";
import { Router } from "preact-router";
import Home from "./pages/home";
import Encrypt from "./pages/encrypt";
import Decrypt from "./pages/decrypt";
import ShareSecurely from "./pages/shareSecurely";
import ChatPage from "./pages/chatPage";
import { PeerIdProvider } from "./components/peerIdContext";
import { ToastContainer } from "react-toastify";
import Invite from "./pages/invite"; // Import the Invite page
import "react-toastify/dist/ReactToastify.css";

export function App() {
    return (
        <PeerIdProvider>
            <Router>
                <Home path="/" />
                <Encrypt path="/encrypt" />
                <Decrypt path="/decrypt" />
                <ShareSecurely path="/shareSecurely" />
                <Invite path="/invite/:connectPeerId" /> {/* Route for invitation */}
                <ChatPage path="/chat/:connectPeerId" />
            </Router>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </PeerIdProvider>
    );
}
