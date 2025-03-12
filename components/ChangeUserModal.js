import React, { useState } from 'react';
import axios from 'axios';

function ChangeUserModal({ user, onClose, onUpdated }) {
    const [newName, setNewName] = useState('');
    const [newPassword, setNewPassword] = useState('');

    async function handleSave() {
        const updateData = {};
        if (newName.trim() !== '') updateData.name = newName.trim();
        if (newPassword.trim() !== '') updateData.password = newPassword.trim();

        try {
            await axios.put(`/api/users/${user.id}`, updateData);
            alert('Update successful');
            onUpdated();
            onClose();
        } catch (err) {
            alert('Failed to update user');
            console.error(err);
        }
    }

    return (
        <div className="inviteUserModal-overlay">
            <div className="frame3">
                <div className="inviteuser">Change Info</div>
                <div className="rectangle6">
                    <input
                        type="text"
                        placeholder="Enter new name"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                </div>
                <div className="assignrole">Change Password</div>
                <div className="rectangle7">
                    <input
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                    />
                </div>
                <div className="invite-buttons">
                    <button className="blue-button" onClick={handleSave}>
                        Save
                    </button>
                    <button className="gray-button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangeUserModal;
