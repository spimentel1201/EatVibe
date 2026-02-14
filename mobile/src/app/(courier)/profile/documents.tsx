import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Document {
    id: string;
    type: string;
    name: string;
    status: 'valid' | 'expiring' | 'expired' | 'pending';
    expirationDate?: string;
    uploadedDate: string;
}

export default function DocumentsScreen() {
    const router = useRouter();

    const documents: Document[] = [
        {
            id: '1',
            type: 'license',
            name: "Driver's License",
            status: 'expiring',
            expirationDate: 'Mar 15, 2026',
            uploadedDate: 'Jan 10, 2024',
        },
        {
            id: '2',
            type: 'background',
            name: 'Background Check',
            status: 'valid',
            uploadedDate: 'Jan 10, 2024',
        },
        {
            id: '3',
            type: 'insurance',
            name: 'Vehicle Insurance',
            status: 'valid',
            expirationDate: 'Dec 31, 2026',
            uploadedDate: 'Jan 10, 2024',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'valid': return '#10B981';
            case 'expiring': return '#F59E0B';
            case 'expired': return '#EF4444';
            case 'pending': return '#3B82F6';
            default: return '#64748B';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'valid': return 'Valid';
            case 'expiring': return 'Expiring Soon';
            case 'expired': return 'Expired';
            case 'pending': return 'Under Review';
            default: return status;
        }
    };

    const getDocumentIcon = (type: string): keyof typeof Ionicons.glyphMap => {
        switch (type) {
            case 'license': return 'card';
            case 'background': return 'shield-checkmark';
            case 'insurance': return 'document-text';
            default: return 'document';
        }
    };

    const handleUploadDocument = (docType: string) => {
        Alert.alert('Upload Document', `Upload new ${docType} document`);
    };

    const handleViewDocument = (doc: Document) => {
        Alert.alert('View Document', `View ${doc.name}`);
    };

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Documents</Text>
                    <View className="w-6" />
                </View>

                <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
                    {/* Info Banner */}
                    <View className="bg-[#3B82F6]/20 rounded-2xl p-4 mb-6 border border-[#3B82F6]/30">
                        <View className="flex-row items-start">
                            <Ionicons name="information-circle" size={24} color="#3B82F6" />
                            <View className="flex-1 ml-3">
                                <Text className="text-[#3B82F6] font-bold mb-1">
                                    Keep Your Documents Updated
                                </Text>
                                <Text className="text-blue-200 text-sm">
                                    Expired documents may affect your ability to accept orders.
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Documents List */}
                    {documents.map((doc) => (
                        <TouchableOpacity
                            key={doc.id}
                            onPress={() => handleViewDocument(doc)}
                            className="bg-[#1A1F3A] rounded-2xl p-4 mb-4 border border-[#2A2F4A]"
                        >
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center flex-1">
                                    <View className="w-12 h-12 rounded-full bg-[#2A2F4A] items-center justify-center mr-4">
                                        <Ionicons
                                            name={getDocumentIcon(doc.type)}
                                            size={24}
                                            color="#3B82F6"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-base mb-1">
                                            {doc.name}
                                        </Text>
                                        <Text className="text-gray-400 text-sm">
                                            Uploaded: {doc.uploadedDate}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    className="px-3 py-1 rounded-full"
                                    style={{ backgroundColor: `${getStatusColor(doc.status)}20` }}
                                >
                                    <Text
                                        className="text-xs font-bold"
                                        style={{ color: getStatusColor(doc.status) }}
                                    >
                                        {getStatusText(doc.status)}
                                    </Text>
                                </View>
                            </View>

                            {doc.expirationDate && (
                                <View className="flex-row items-center mb-3">
                                    <Ionicons name="calendar" size={16} color="#64748B" />
                                    <Text className="text-gray-400 text-sm ml-2">
                                        Expires: {doc.expirationDate}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={() => handleUploadDocument(doc.name)}
                                className="bg-[#2A2F4A] rounded-xl py-3 flex-row items-center justify-center"
                            >
                                <Ionicons name="cloud-upload" size={20} color="#3B82F6" />
                                <Text className="text-[#3B82F6] font-semibold ml-2">
                                    Upload New Document
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))}

                    {/* View Background Check Report */}
                    <TouchableOpacity
                        onPress={() => Alert.alert('Background Check', 'View full report')}
                        className="bg-[#1A1F3A] rounded-2xl py-4 border border-[#2A2F4A] flex-row items-center justify-center mb-6"
                    >
                        <Ionicons name="document-text" size={20} color="#3B82F6" />
                        <Text className="text-[#3B82F6] font-semibold ml-2">
                            View Background Check Report
                        </Text>
                    </TouchableOpacity>

                    <View className="h-8" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
