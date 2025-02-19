import React, { useState } from 'react';

interface ChatPageProps {
    connected: boolean;
    messages: Array<{ sender: string; content: string; messageType: string }>;
    onSendMessage: (content: string) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ connected, messages, onSendMessage }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSendMessage(message);
        setMessage('');
    };

    return (
        <div id="chat-page" className={connected ? '' : 'hidden'}>
            <div className="chat-container">
                <div className="chat-header">
                    <h2>Spring WebSocket Chat Demo</h2>
                </div>
                <div className={`connecting ${connected ? 'hidden' : ''}`}>Connecting...</div>
                <ul id="messageArea">
                    {messages.map((msg, index) => (
                        <li key={index} className={msg.messageType === 'JOIN' || msg.messageType === 'LEAVE' ? 'event-message' : 'chat-message'}>
                            {msg.messageType === 'CHAT' && (
                                <>
                                    <i style={{ backgroundColor: getAvatarColor(msg.sender) }}>{msg.sender[0]}</i>
                                    <span>{msg.sender}</span>
                                </>
                            )}
                            <p>{msg.content}</p>
                        </li>
                    ))}
                </ul>
                <form id="messageForm" name="messageForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <div className="input-group clearfix">
                            <input
                                type="text"
                                id="message"
                                placeholder="Type a message..."
                                autoComplete="off"
                                className="form-control"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button type="submit" className="primary">
                                Send
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const getAvatarColor = (messageSender: string): string => {
    const colors = [
        '#2196F3', '#32c787', '#00BCD4', '#ff5652',
        '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
    ];
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
};

export default ChatPage;