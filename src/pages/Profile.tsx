import {
    Box,
    Heading,
    Text,
    VStack,
    SimpleGrid,
    Divider,
    Alert,
    AlertIcon,
    AlertDescription,
    useToast,
    Icon,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import Section from '../components/layout/Section';
import CustomCard from '../components/common/CustomCard';
import CustomButton from '../components/common/CustomButton';
import FormInput from '../components/common/FormInput';

const Profile = () => {
    const toast = useToast();

    // Profile form state
    const [profile, setProfile] = useState({
        fullName: '',
        phone: '',
        linkedinUrl: '',
        portfolioUrl: '',
    });

    // Password form state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const handleProfileSave = async () => {
        setSavingProfile(true);
        try {
            const response = await fetch('/api/users/me', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile),
            });
            if (!response.ok) throw new Error('Failed to update profile');
            toast({ title: 'Profile updated successfully', status: 'success', duration: 3000 });
        } catch {
            toast({ title: 'Failed to update profile', status: 'error', duration: 3000 });
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            toast({ title: 'Passwords do not match', status: 'error', duration: 3000 });
            return;
        }
        if (passwords.newPassword.length < 8) {
            toast({ title: 'Password must be at least 8 characters', status: 'warning', duration: 3000 });
            return;
        }

        setSavingPassword(true);
        try {
            const response = await fetch('/api/users/me/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to change password');
            }
            toast({ title: 'Password changed successfully', status: 'success', duration: 3000 });
            setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (err: any) {
            toast({ title: err.message || 'Failed to change password', status: 'error', duration: 3000 });
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <Box bg="gray.50" minH="calc(100vh - 64px)">
            <Section>
                <Heading size="lg" mb={2}>Profile & Settings</Heading>
                <Text color="gray.500" mb={8}>Manage your account information and preferences.</Text>

                <Alert status="info" mb={6} borderRadius="md">
                    <AlertIcon />
                    <AlertDescription fontSize="sm">
                        These settings will take effect once user authentication is configured.
                    </AlertDescription>
                </Alert>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                    {/* Profile Information */}
                    <CustomCard>
                        <Heading size="md" mb={6}>
                            <Icon as={FaUser} mr={2} color="brand.500" />
                            Profile Information
                        </Heading>
                        <VStack spacing={4} align="stretch">
                            <FormInput
                                id="profile-fullName"
                                label="Full Name"
                                placeholder="Bhupender Yadav"
                                value={profile.fullName}
                                onChange={(e: any) => setProfile(p => ({ ...p, fullName: e.target.value }))}
                            />
                            <FormInput
                                id="profile-phone"
                                label="Phone"
                                placeholder="+91 98765 43210"
                                value={profile.phone}
                                onChange={(e: any) => setProfile(p => ({ ...p, phone: e.target.value }))}
                            />
                            <FormInput
                                id="profile-linkedin"
                                label="LinkedIn URL"
                                placeholder="https://linkedin.com/in/username"
                                value={profile.linkedinUrl}
                                onChange={(e: any) => setProfile(p => ({ ...p, linkedinUrl: e.target.value }))}
                            />
                            <FormInput
                                id="profile-portfolio"
                                label="Portfolio URL"
                                placeholder="https://yourportfolio.com"
                                value={profile.portfolioUrl}
                                onChange={(e: any) => setProfile(p => ({ ...p, portfolioUrl: e.target.value }))}
                            />
                            <CustomButton
                                mt={2}
                                onClick={handleProfileSave}
                                isLoading={savingProfile}
                                loadingText="Saving..."
                            >
                                Save Profile
                            </CustomButton>
                        </VStack>
                    </CustomCard>

                    {/* Security */}
                    <CustomCard>
                        <Heading size="md" mb={6}>
                            <Icon as={FaLock} mr={2} color="brand.500" />
                            Change Password
                        </Heading>
                        <VStack spacing={4} align="stretch">
                            <FormInput
                                id="password-current"
                                label="Current Password"
                                type="password"
                                placeholder="Enter current password"
                                value={passwords.currentPassword}
                                onChange={(e: any) => setPasswords(p => ({ ...p, currentPassword: e.target.value }))}
                            />
                            <FormInput
                                id="password-new"
                                label="New Password"
                                type="password"
                                placeholder="Min 8 characters"
                                value={passwords.newPassword}
                                onChange={(e: any) => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
                            />
                            <FormInput
                                id="password-confirm"
                                label="Confirm New Password"
                                type="password"
                                placeholder="Repeat new password"
                                value={passwords.confirmNewPassword}
                                onChange={(e: any) => setPasswords(p => ({ ...p, confirmNewPassword: e.target.value }))}
                            />
                            <Divider />
                            <CustomButton
                                onClick={handlePasswordChange}
                                isLoading={savingPassword}
                                loadingText="Changing..."
                                isDisabled={!passwords.currentPassword || !passwords.newPassword}
                            >
                                Change Password
                            </CustomButton>
                        </VStack>
                    </CustomCard>
                </SimpleGrid>
            </Section>
        </Box>
    );
};

export default Profile;
