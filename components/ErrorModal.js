
import React from 'react';
import CustomModal from './CustomModal';

export default function ErrorModal({ visible, title = "Error", message, onClose, buttons, icon = "alert-triangle", iconColor = "#ef4444" }) {
    // Default single button if none provided
    const defaultButtons = [
        {
            text: 'Close',
            type: 'secondary',
            onPress: onClose
        }
    ];

    return (
        <CustomModal
            visible={visible}
            title={title}
            message={message}
            onClose={onClose}
            icon={icon}
            iconColor={iconColor}
            buttons={buttons || defaultButtons}
        />
    );
}
