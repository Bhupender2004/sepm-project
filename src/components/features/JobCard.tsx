import { Box, Flex, HStack, Text, Badge, Icon, Avatar } from '@chakra-ui/react';
import { FaMapMarkerAlt, FaBriefcase, FaRegBookmark } from 'react-icons/fa';
import CustomCard from '../common/CustomCard';
import CustomButton from '../common/CustomButton';
import type { Job } from '../../services/MockAnalysisService';

interface JobCardProps {
    job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
    return (
        <CustomCard p={5} _hover={{ shadow: 'lg', borderColor: 'brand.200' }} transition="all 0.2s">
            <Flex gap={4}>
                <Avatar src={job.logo} name={job.company} size="md" borderRadius="md" />
                <Box flex="1">
                    <Flex justify="space-between" align="start">
                        <Box>
                            <Text fontWeight="bold" fontSize="lg">{job.title}</Text>
                            <Text color="gray.600">{job.company}</Text>
                        </Box>
                        <Badge
                            colorScheme={job.matchScore > 90 ? 'green' : job.matchScore > 70 ? 'yellow' : 'red'}
                            fontSize="sm"
                            px={2}
                            py={1}
                            borderRadius="full"
                        >
                            {job.matchScore}% Match
                        </Badge>
                    </Flex>

                    <HStack mt={3} spacing={4} color="gray.500" fontSize="sm">
                        <HStack>
                            <Icon as={FaMapMarkerAlt} />
                            <Text>{job.location}</Text>
                        </HStack>
                        <HStack>
                            <Icon as={FaBriefcase} />
                            <Text>{job.type}</Text>
                        </HStack>
                        <Text>• {job.posted}</Text>
                    </HStack>
                </Box>
            </Flex>

            <Flex mt={4} gap={3}>
                <CustomButton variant="outline" size="sm" leftIcon={<Icon as={FaRegBookmark} />}>
                    Save
                </CustomButton>
                <CustomButton size="sm" flex="1">
                    Apply Now
                </CustomButton>
            </Flex>
        </CustomCard>
    );
};

export default JobCard;
