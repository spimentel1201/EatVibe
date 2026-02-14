import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View className="mb-6">
        <Text className="text-gray-400 text-xs font-bold tracking-wider mb-3 px-6">
            {title}
        </Text>
        <View className="bg-[#1A1F3A] border border-[#2A2F4A]">
            {children}
        </View>
    </View>
);

const SettingRow = ({
    icon,
    label,
    value,
    onValueChange,
    type = 'switch',
    onPress,
    showChevron = false,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: boolean | string;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'text';
    onPress?: () => void;
    showChevron?: boolean;
}) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={type === 'switch'}
        className="flex-row items-center justify-between px-6 py-4 border-b border-[#2A2F4A] last:border-b-0"
    >
        <View className="flex-row items-center flex-1">
            <Ionicons name={icon} size={20} color="#3B82F6" />
            <Text className="text-white ml-3 flex-1">{label}</Text>
        </View>
        {type === 'switch' && onValueChange && (
            <Switch
                value={value as boolean}
                onValueChange={onValueChange}
                trackColor={{ false: '#2A2F4A', true: '#3B82F6' }}
                thumbColor={value ? '#FFF' : '#64748B'}
            />
        )}
        {type === 'text' && (
            <View className="flex-row items-center">
                <Text className="text-gray-400 mr-2">{value as string}</Text>
                {showChevron && <Ionicons name="chevron-forward" size={20} color="#64748B" />}
            </View>
        )}
    </TouchableOpacity>
);

export default function AppSettingsScreen() {
    const router = useRouter();

    // Appearance
    const [darkMode, setDarkMode] = useState(true);
    const [autoTheme, setAutoTheme] = useState(false);

    // Notifications
    const [orderAlerts, setOrderAlerts] = useState(true);
    const [earningsUpdates, setEarningsUpdates] = useState(true);
    const [promotions, setPromotions] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    // Delivery Preferences
    const [autoAccept, setAutoAccept] = useState(false);
    const [preferredDistance] = useState('5 miles');

    // Privacy
    const [shareLocation, setShareLocation] = useState(true);
    const [analytics, setAnalytics] = useState(true);

    return (
        <View className="flex-1 bg-[#0A0E27]">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">App Settings</Text>
                    <View className="w-6" />
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Appearance */}
                    <SettingSection title="APPEARANCE">
                        <SettingRow
                            icon="moon"
                            label="Dark Mode"
                            value={darkMode}
                            onValueChange={setDarkMode}
                        />
                        <SettingRow
                            icon="sunny"
                            label="Auto Theme (System)"
                            value={autoTheme}
                            onValueChange={setAutoTheme}
                        />
                    </SettingSection>

                    {/* Notifications */}
                    <SettingSection title="NOTIFICATIONS">
                        <SettingRow
                            icon="notifications"
                            label="Order Alerts"
                            value={orderAlerts}
                            onValueChange={setOrderAlerts}
                        />
                        <SettingRow
                            icon="cash"
                            label="Earnings Updates"
                            value={earningsUpdates}
                            onValueChange={setEarningsUpdates}
                        />
                        <SettingRow
                            icon="gift"
                            label="Promotions & Bonuses"
                            value={promotions}
                            onValueChange={setPromotions}
                        />
                        <SettingRow
                            icon="volume-high"
                            label="Sound"
                            value={soundEnabled}
                            onValueChange={setSoundEnabled}
                        />
                        <SettingRow
                            icon="phone-portrait"
                            label="Vibration"
                            value={vibrationEnabled}
                            onValueChange={setVibrationEnabled}
                        />
                    </SettingSection>

                    {/* Units */}
                    <SettingSection title="UNITS & LANGUAGE">
                        <SettingRow
                            icon="navigate"
                            label="Distance Unit"
                            value="Miles"
                            type="text"
                            showChevron
                            onPress={() => { }}
                        />
                        <SettingRow
                            icon="cash"
                            label="Currency"
                            value="USD ($)"
                            type="text"
                            showChevron
                            onPress={() => { }}
                        />
                        <SettingRow
                            icon="language"
                            label="Language"
                            value="English"
                            type="text"
                            showChevron
                            onPress={() => { }}
                        />
                    </SettingSection>

                    {/* Delivery Preferences */}
                    <SettingSection title="DELIVERY PREFERENCES">
                        <SettingRow
                            icon="flash"
                            label="Auto-Accept Orders"
                            value={autoAccept}
                            onValueChange={setAutoAccept}
                        />
                        <SettingRow
                            icon="location"
                            label="Preferred Max Distance"
                            value={preferredDistance}
                            type="text"
                            showChevron
                            onPress={() => { }}
                        />
                        <SettingRow
                            icon="map"
                            label="Navigation App"
                            value="Google Maps"
                            type="text"
                            showChevron
                            onPress={() => { }}
                        />
                    </SettingSection>

                    {/* Privacy */}
                    <SettingSection title="PRIVACY & DATA">
                        <SettingRow
                            icon="location"
                            label="Share Location While Working"
                            value={shareLocation}
                            onValueChange={setShareLocation}
                        />
                        <SettingRow
                            icon="analytics"
                            label="Usage Analytics"
                            value={analytics}
                            onValueChange={setAnalytics}
                        />
                    </SettingSection>

                    {/* About */}
                    <SettingSection title="ABOUT">
                        <SettingRow
                            icon="information-circle"
                            label="App Version"
                            value="1.0.0"
                            type="text"
                        />
                        <SettingRow
                            icon="document-text"
                            label="Terms of Service"
                            type="text"
                            showChevron
                            onPress={() => { }}
                        />
                        <SettingRow
                            icon="shield-checkmark"
                            label="Privacy Policy"
                            type="text"
                            showChevron
                            onPress={() => { }}
                        />
                    </SettingSection>

                    <View className="h-8" />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
