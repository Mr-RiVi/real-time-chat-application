import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import UsernameForm from "./UsernameForm";
import ChatPage from "../pages/ChatPage";
import "../assets/css/ChatApp.css";

interface ChatMessage {
    sender: string;
    content: string;
    messageType: string;
}

const SOCKET_URL = "http://localhost:8080/ws";

const ChatApp: React.FC = () => {
    const [username, setUsername] = useState<string | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");

    const stompClientRef = useRef<Stomp.Client | null>(null); // Use useRef instead of a local variable

    useEffect(() => {
        if (username) {
            initializeWebSocketConnection();
        }
        return cleanupWebSocketConnection;
    }, [username]);

    const initializeWebSocketConnection = () => {
        setConnectionStatus("connecting");

        let socket = new SockJS(SOCKET_URL);
        console.log(JSON.stringify(socket));

        const stompClient = Stomp.over(socket);
        stompClientRef.current = stompClient; // Store in ref

        stompClient.connect(
            {},
            onConnected,
            (error: string | Stomp.Frame) => onError(error.toString())
        );
    };

    const onConnected = () => {
        console.log("Connected to WebSocket");
        setConnected(true);
        setConnectionStatus("connected");

        if (!stompClientRef.current) return;

        // Subscribe to public chat topic
        stompClientRef.current.subscribe("/topic/public", onMessageReceived);

        // Notify server that user has joined
        notifyUserJoin();
    };

    const onMessageReceived = (message: Stomp.Message) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        console.log(`Received: ${message.body}`);
        setMessages((prevMessages) => [...prevMessages, chatMessage]);
    };

    const notifyUserJoin = () => {
        if (stompClientRef.current && username) {
            stompClientRef.current.send(
                "/app/chat.addUser",
                {},
                JSON.stringify({ sender: username, messageType: "JOIN" })
            );
        }
    };

    const onError = (error: string) => {
        console.error("WebSocket error:", error);
        setConnectionStatus("error");
    };

    const cleanupWebSocketConnection = () => {
        if (stompClientRef.current && connected) {
            stompClientRef.current.disconnect(() => {
                console.log("Disconnected from WebSocket");
                setConnected(false);
                setConnectionStatus("disconnected");
            });
        }
    };

    const handleUsernameSubmit = (username: string) => {
        setUsername(username);
    };

    const sendMessage = (content: string) => {
        if (stompClientRef.current && username) {
            const chatMessage = {
                sender: username,
                content,
                messageType: "CHAT",
            };
            console.log("chat message is:", JSON.stringify(chatMessage));

            stompClientRef.current.send(
                "/app/chat.sendMessage",
                {},
                JSON.stringify(chatMessage)
            );
        }
    };

    return (
        <div className="chat-app">
            {!username ? (
                <UsernameForm onUsernameSubmit={handleUsernameSubmit} />
            ) : (
                <>
                    <div className="connection-status">
                        Status: {connectionStatus}
                    </div>
                    <ChatPage
                        connected={connected}
                        messages={messages}
                        onSendMessage={sendMessage}
                    />
                </>
            )}
        </div>
    );
};

export default ChatApp;
