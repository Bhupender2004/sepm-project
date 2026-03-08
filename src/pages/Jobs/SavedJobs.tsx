import {
    Box,
    Heading,
    Text,
    VStack,
    HStack,
    Badge,
    Select,
    Textarea,
    Divider,
    Icon,
    SimpleGrid,
    Flex,
    Spinner,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaBookmark, FaExternalLinkAlt, FaTrash, FaBriefcase } from 'react-icons/fa';
import Section from '../../components/layout/Section';
import CustomCard from '../../components/common/CustomCard';
import CustomButton from '../../components/common/CustomButton';
import { Link as RouterLink } from 'react-router-dom';
import {
    getSavedJobs,
    updateSavedJob,
    unsaveJob,
    type SavedJobEntry,
} from '../../services/SavedJobService';

const STATUS_OPTIONS = [
    { value: 'saved', label: 'Saved', color: 'blue' },
    { value: 'interested', label: 'Interested', color: 'purple' },
    { value: 'applied', label: 'Applied', color: 'green' },
    { value: 'not_interested', label: 'Not Interested', color: 'gray' },
];

const statusColor = (s: string) =>
    STATUS_OPTIONS.find(o => o.value === s)?.color ?? 'gray';

const SavedJobs = () => {
    const [jobs, setJobs] = useState<SavedJobEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const toast = useToast();

    useEffect(() => {
        getSavedJobs()
            .then(data => {
                setJobs(data);
                const n: Record<string, string> = {};
                data.forEach(j => { if (j.notes) n[j.id] = j.notes; });
                setNotes(n);
            })
            .catch(() => toast({ title: 'Failed to load saved jobs', status: 'error' }))
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (savedJobId: string, applicationStatus: string) => {
        await updateSavedJob(savedJobId, { applicationStatus }).catch(() => null);
        setJobs(prev => prev.map(j => j.id === savedJobId ? { ...j, applicationStatus: applicationStatus as any } : j));
    };

    const handleNoteSave = async (savedJobId: string) => {
        await updateSavedJob(savedJobId, { notes: notes[savedJobId] ?? '' }).catch(() => null);
        toast({ title: 'Note saved', status: 'success', duration: 1500 });
    };

    const handleUnsave = async (savedJobId: string) => {
        await unsaveJob(savedJobId);
        setJobs(prev => prev.filter(j => j.id !== savedJobId));
        toast({ title: 'Job removed', status: 'info', duration: 2000 });
    };

    // Stats
    const counts = STATUS_OPTIONS.map(o => ({
        ...o,
        count: jobs.filter(j => j.applicationStatus === o.value).length,
    }));

    return (
        <Box bg="transparent" minH="calc(100vh - 64px)">
            <Section>
                <Flex justify="space-between" align="center" mb={8} flexWrap="wrap" gap={4}>
                    <Box>
                        <Heading size="lg">Saved Jobs</Heading>
                        <Text color="gray.500" fontSize="sm" mt={1}>
                            Track your job applications in one place
                        </Text>
                    </Box>
                    <CustomButton as={RouterLink} to="/jobs" size="sm">
                        Find More Jobs
                    </CustomButton>
                </Flex>

                {/* Stats bar */}
                <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={8}>
                    {counts.map(o => (
                        <CustomCard key={o.value} textAlign="center" py={4}>
                            <Text fontSize="2xl" fontWeight="bold" color={`${o.color}.500`}>{o.count}</Text>
                            <Text fontSize="sm" color="gray.500">{o.label}</Text>
                        </CustomCard>
                    ))}
                </SimpleGrid>

                {loading && (
                    <Flex justify="center" py={16}>
                        <Spinner size="xl" color="brand.500" />
                    </Flex>
                )}

                {!loading && jobs.length === 0 && (
                    <CustomCard textAlign="center" py={16}>
                        <Icon as={FaBookmark} boxSize={10} color="gray.300" mb={4} />
                        <Heading size="md" mb={2}>No Saved Jobs Yet</Heading>
                        <Text color="gray.500" mb={6}>
                            Browse jobs and click the bookmark icon to save them here.
                        </Text>
                        <CustomButton as={RouterLink} to="/jobs">Find Jobs</CustomButton>
                    </CustomCard>
                )}

                <VStack spacing={5} align="stretch">
                    {jobs.map(entry => (
                        <CustomCard key={entry.id}>
                            <Flex justify="space-between" align="flex-start" flexWrap="wrap" gap={4}>
                                {/* Job info */}
                                <Box flex={1}>
                                    <HStack mb={1} flexWrap="wrap">
                                        <Text fontWeight="bold" fontSize="lg">{entry.job.jobTitle}</Text>
                                        <Badge colorScheme={statusColor(entry.applicationStatus)}>
                                            {STATUS_OPTIONS.find(o => o.value === entry.applicationStatus)?.label}
                                        </Badge>
                                    </HStack>
                                    <HStack color="gray.600" fontSize="sm" spacing={4} flexWrap="wrap" mb={2}>
                                        <HStack>
                                            <Icon as={FaBriefcase} />
                                            <Text>{entry.job.company}</Text>
                                        </HStack>
                                        <Text>📍 {entry.job.location}</Text>
                                        <Badge variant="outline" colorScheme="gray">{entry.job.sourcePlatform}</Badge>
                                    </HStack>
                                    {entry.job.description && (
                                        <Text fontSize="sm" color="gray.500" noOfLines={2}>
                                            {entry.job.description}
                                        </Text>
                                    )}
                                </Box>

                                {/* Actions */}
                                <VStack spacing={2} align="stretch" minW="180px">
                                    <Select
                                        size="sm"
                                        value={entry.applicationStatus}
                                        onChange={(e) => handleStatusChange(entry.id, e.target.value)}
                                        borderColor="gray.300"
                                    >
                                        {STATUS_OPTIONS.map(o => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </Select>
                                    <a href={entry.job.postingUrl} target="_blank" rel="noopener noreferrer">
                                        <CustomButton size="sm" w="full" variant="outline">
                                            <Icon as={FaExternalLinkAlt} mr={2} />
                                            View Posting
                                        </CustomButton>
                                    </a>
                                    <CustomButton
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleUnsave(entry.id)}
                                    >
                                        <Icon as={FaTrash} mr={2} />
                                        Remove
                                    </CustomButton>
                                </VStack>
                            </Flex>

                            <Divider my={4} />

                            {/* Notes */}
                            <Box>
                                <Text fontSize="sm" fontWeight="medium" mb={2}>Notes</Text>
                                <Textarea
                                    size="sm"
                                    placeholder="Add notes about this job..."
                                    value={notes[entry.id] ?? ''}
                                    onChange={(e) => setNotes(prev => ({ ...prev, [entry.id]: e.target.value }))}
                                    rows={2}
                                    borderColor="gray.200"
                                />
                                <CustomButton
                                    size="xs"
                                    mt={2}
                                    variant="ghost"
                                    onClick={() => handleNoteSave(entry.id)}
                                >
                                    Save Note
                                </CustomButton>
                            </Box>
                        </CustomCard>
                    ))}
                </VStack>
            </Section>
        </Box>
    );
};

export default SavedJobs;
