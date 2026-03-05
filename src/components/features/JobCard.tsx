import { Box, Flex, HStack, Text, Badge, Icon, Avatar, Tooltip, useToast } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaBriefcase, FaExternalLinkAlt, FaBookmark, FaRegBookmark, FaDollarSign } from 'react-icons/fa';
import { useState } from 'react';
import CustomCard from '../common/CustomCard';
import CustomButton from '../common/CustomButton';
import type { Job } from '../../services/JobService';
import { saveJob } from '../../services/SavedJobService';

interface JobCardProps {
    job: Job;
}

const sourceColorMap: Record<string, string> = {
    Remotive: 'purple',
    RemoteOK: 'cyan',
    LinkedIn: 'linkedin',
    Naukri: 'blue',
    Glassdoor: 'green',
    Indeed: 'orange',
    Google: 'red',
};

const JobCard = ({ job }: JobCardProps) => {
    const matchColor = job.matchScore >= 80 ? 'green' : job.matchScore >= 60 ? 'yellow' : 'orange';
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const toast = useToast();

    const handleSave = async () => {
        if (saved) {
            toast({ title: 'Already saved!', status: 'info', duration: 2000 });
            return;
        }
        setSaving(true);
        try {
            await saveJob({
                externalJobId: job.id,
                sourcePlatform: job.source,
                jobTitle: job.title,
                company: job.company,
                location: job.location,
                jobType: job.type,
                description: job.description,
                postingUrl: job.postingUrl,
                salary: job.salary,
                tags: job.tags,
            });
            setSaved(true);
            toast({ title: '✅ Job saved!', description: `${job.title} at ${job.company}`, status: 'success', duration: 2500 });
        } catch (err: any) {
            if (err.message?.includes('already saved')) {
                setSaved(true);
                toast({ title: 'Already in your saved list', status: 'info', duration: 2000 });
            } else {
                toast({ title: 'Failed to save job', description: err.message, status: 'error', duration: 3000 });
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <CustomCard p={5} _hover={{ shadow: 'lg', borderColor: 'brand.200' }} transition="all 0.2s">
            <Flex gap={4}>
                <Avatar
                    src={job.companyLogo}
                    name={job.company}
                    size="md"
                    borderRadius="md"
                    bg="gray.100"
                />
                <Box flex="1" minW={0}>
                    <Flex justify="space-between" align="start" wrap="wrap" gap={2}>
                        <Box flex="1" minW={0}>
                            <Text fontWeight="bold" fontSize="lg" noOfLines={1}>{job.title}</Text>
                            <Text color="gray.600" noOfLines={1}>{job.company}</Text>
                        </Box>
                        <HStack spacing={2} flexShrink={0}>
                            <Badge
                                colorScheme={sourceColorMap[job.source] || 'gray'}
                                fontSize="xs"
                                px={2} py={0.5}
                                borderRadius="full"
                            >
                                {job.source}
                            </Badge>
                            <Badge
                                colorScheme={matchColor}
                                fontSize="sm"
                                px={2} py={1}
                                borderRadius="full"
                            >
                                {job.matchScore}% Match
                            </Badge>
                        </HStack>
                    </Flex>

                    {job.description && (
                        <Text mt={2} fontSize="sm" color="gray.500" noOfLines={2}>
                            {job.description}
                        </Text>
                    )}

                    <HStack mt={3} spacing={4} color="gray.500" fontSize="sm" flexWrap="wrap">
                        <HStack>
                            <Icon as={FaMapMarkerAlt} />
                            <Text>{job.location}</Text>
                        </HStack>
                        <HStack>
                            <Icon as={FaBriefcase} />
                            <Text>{job.type}</Text>
                        </HStack>
                        {job.salary && (
                            <HStack>
                                <Icon as={FaDollarSign} />
                                <Text>{job.salary}</Text>
                            </HStack>
                        )}
                        <Text>• {job.posted}</Text>
                    </HStack>

                    {job.tags && job.tags.length > 0 && (
                        <Flex mt={3} gap={2} flexWrap="wrap">
                            {job.tags.slice(0, 5).map(tag => (
                                <Badge key={tag} colorScheme="gray" variant="subtle" fontSize="xs">
                                    {tag}
                                </Badge>
                            ))}
                        </Flex>
                    )}
                </Box>
            </Flex>

            <Flex mt={4} gap={3}>
                <Tooltip label={saved ? 'Saved to your list' : 'Save this job'} placement="top">
                    <CustomButton
                        variant={saved ? 'solid' : 'outline'}
                        colorScheme={saved ? 'green' : undefined}
                        size="sm"
                        leftIcon={<Icon as={saved ? FaBookmark : FaRegBookmark} />}
                        onClick={handleSave}
                        isLoading={saving}
                        loadingText="Saving..."
                    >
                        {saved ? 'Saved' : 'Save'}
                    </CustomButton>
                </Tooltip>
                <Box as="a" href={job.postingUrl} target="_blank" rel="noopener noreferrer" flex="1">
                    <CustomButton
                        size="sm"
                        w="full"
                        rightIcon={<Icon as={FaExternalLinkAlt} />}
                    >
                        Apply Now
                    </CustomButton>
                </Box>
            </Flex>
        </CustomCard>
    );
};

export default JobCard;
