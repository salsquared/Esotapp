
import React from 'react';
import CustomModal from './CustomModal';

export default function SuccessModal({ visible, title = "Success", message, onClose, buttons }) {
    // Default single button if none provided
    const defaultButtons = [
        {
            text: 'OK',
            type: 'primary',
            onPress: onClose
        }
    ];

    return (
        <CustomModal
            visible={visible}
            title={title}
            message={message}
            onClose={onClose}
            icon="check-circle"
            iconColor="#22c55e" // Green
            buttons={buttons || defaultButtons}
        />
    );
}
