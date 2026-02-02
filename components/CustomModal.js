import React from 'react';
import { View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function CustomModal({ visible, title, message, buttons, onClose, icon, iconColor = "#22c55e" }) {
    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/50 justify-center items-center p-4">
                    <TouchableWithoutFeedback>
                        <View className="bg-gray-900 rounded-3xl p-6 w-4/5 max-w-xs border border-gray-700">
                            <View className="flex-row justify-center items-center mb-3">
                                {title && <Text className="text-white text-3xl font-bold text-center tracking-tight mr-2">{title}</Text>}
                                {icon && <Feather name={icon} size={32} color={iconColor} />}
                            </View>
                            {message && <Text className="text-gray-400 text-base mb-6 text-center leading-5">{message}</Text>}

                            <View className="flex-row gap-3">
                                {buttons && buttons.map((btn, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={btn.onPress}
                                        className={`flex-1 py-3 px-2 rounded-xl items-center justify-center ${btn.type === 'secondary'
                                            ? 'bg-gray-800 border border-gray-600'
                                            : 'bg-blue-600'
                                            }`}
                                    >
                                        <Text
                                            className={`font-bold text-base ${btn.type === 'secondary' ? 'text-gray-300' : 'text-white'
                                                }`}
                                            numberOfLines={1}
                                        >
                                            {btn.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
