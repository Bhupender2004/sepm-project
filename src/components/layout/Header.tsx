import {
    Box,
    Flex,
    Text,
    IconButton,
    Stack,
    Collapse,
    useColorModeValue,
    useDisclosure,
    Container,
    HStack,
    Icon,
    Circle,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { FiGrid, FiFileText, FiBriefcase, FiBookmark } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';


export default function Header() {
    const { isOpen, onToggle } = useDisclosure();


    return (
        <Box
            position="sticky"
            top={0}
            zIndex="sticky"
            as="header"
            css={{
                backdropFilter: 'blur(20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
            }}
            _dark={{
                css: {
                    backgroundColor: 'rgba(26, 32, 44, 0.4)',
                }
            }}
            borderBottom={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('whiteAlpha.300', 'whiteAlpha.100')}>
            <Flex
                minH={'70px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                align={'center'}>
                <Container maxW="container.xl" display="flex" alignItems="center">
                    <Flex
                        flex={{ base: 1, md: 'auto' }}
                        ml={{ base: -2 }}
                        display={{ base: 'flex', md: 'none' }}>
                        <IconButton
                            onClick={onToggle}
                            icon={
                                isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                            }
                            variant={'ghost'}
                            aria-label={'Toggle Navigation'}
                        />
                    </Flex>
                    <Flex justify={{ base: 'center', md: 'start' }} alignItems="center">
                        <HStack
                            as={RouterLink}
                            to="/"
                            spacing={2}
                            _hover={{ textDecoration: 'none' }}
                        >
                            <Circle size="10" bg="#7AAACE" color="white">
                                <Icon as={BsStars} w={5} h={5} />
                            </Circle>
                            <Text
                                textAlign={useDisclosure().isOpen ? 'center' : 'left'}
                                fontFamily={'heading'}
                                fontWeight="bold"
                                fontSize="2xl"
                                color="gray.800"
                            >
                                ResumeAI
                            </Text>
                        </HStack>
                    </Flex>

                    <Flex display={{ base: 'none', md: 'flex' }} flex={1} justify="flex-end" mr={10}>
                        <DesktopNav />
                    </Flex>


                </Container>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

const DesktopNav = () => {
    const location = useLocation();
    const linkColor = 'gray.500';
    const activeColor = '#7AAACE';

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: FiGrid },
        { label: 'Analyze', href: '/', icon: FiFileText },
        { label: 'Jobs', href: '/jobs', icon: FiBriefcase },
        { label: 'Saved', href: '/saved-jobs', icon: FiBookmark },
    ];

    return (
        <Stack direction={'row'} spacing={8}>
            {navItems.map((navItem) => {
                const isActive = location.pathname === navItem.href;
                return (
                    <Box key={navItem.label} position="relative" height="70px" display="flex" alignItems="center">
                        <HStack
                            as={RouterLink}
                            to={navItem.href}
                            spacing={2}
                            color={isActive ? activeColor : linkColor}
                            _hover={{ color: activeColor }}
                            fontWeight={isActive ? 600 : 500}
                        >
                            <Icon as={navItem.icon} w={4} h={4} />
                            <Text fontSize={'md'}>{navItem.label}</Text>
                        </HStack>
                        {isActive && (
                            <Box
                                position="absolute"
                                bottom={0}
                                left={0}
                                right={0}
                                height="3px"
                                bg={activeColor}
                                borderTopRadius="sm"
                            />
                        )}
                    </Box>
                );
            })}
        </Stack>
    );
};

const MobileNav = () => {
    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analyze', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Saved', href: '/saved-jobs' },
    ];

    return (
        <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
            {navItems.map((navItem) => (
                <Stack spacing={4} key={navItem.label}>
                    <Box
                        py={2}
                        as={RouterLink}
                        to={navItem.href}
                        justifyContent="space-between"
                        alignItems="center"
                        _hover={{
                            textDecoration: 'none',
                        }}>
                        <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                            {navItem.label}
                        </Text>
                    </Box>
                </Stack>
            ))}
        </Stack>
    );
};
