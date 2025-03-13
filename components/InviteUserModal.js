import React, { useState } from 'react';
import axios from 'axios';

function InviteUserModal({ onClose, onInvited, boardId, existingUsers }) {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');

    const handleInvite = async () => {
        // 1) Check if the email already exists in the user list
        const alreadyInvited = existingUsers.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );
        if (alreadyInvited) {
            alert(`User with email ${email} is already in this board.`);
            return;
        }

        try {
            // 2) First check if the user exists
            //    Note: now pointing to http://localhost:8080
            await axios.post('http://localhost:8080/api/users/check', { email });

            // 3) Invite the user to the board
            const inviteDto = {
                email,
                boardId,
                role: role.toUpperCase(), // e.g. "ADMIN"
            };

            await axios.post('http://localhost:8080/api/user-access/invite', inviteDto);
            alert(`Invited user: ${email} as ${role}`);
            onInvited();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                alert(err.response.data);
            } else {
                alert('Invite failed');
            }
        }
    };

    return (
        <div className="inviteUserModal-overlay">
            <div className="frame3">
                <div className="inviteuser">Invite User</div>
                <div className="rectangle6">
                    <input
                        type="text"
                        placeholder="Enter email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="assignrole">Assign Role</div>
                <div className="rectangle7">
                    <select value={role} onChange={e => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                </div>
                <div className="invite-buttons">
                    <button className="blue-button" onClick={handleInvite}>
                        Invite
                    </button>
                    <button className="gray-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InviteUserModal;
