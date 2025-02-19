import React, { useState } from 'react';

interface UsernameFormProps {
    onUsernameSubmit: (username: string) => void;
}

const UsernameForm: React.FC<UsernameFormProps> = ({ onUsernameSubmit }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUsernameSubmit(username);
    };

    return (
        <div id="username-page">
            <div className="username-page-container">
                <h1 className="title">Type your username to enter the Chatroom</h1>
                <form id="usernameForm" name="usernameForm" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            id="name"
                            placeholder="Username"
                            autoComplete="off"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" className="accent username-submit">
                            Start Chatting
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UsernameForm;