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
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import CustomButton from '../common/CustomButton';

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
                        <Text
                            textAlign={useDisclosure().isOpen ? 'center' : 'left'}
                            fontFamily={'heading'}
                            fontWeight="bold"
                            fontSize="2xl"
                            color="brand.600"
                            _dark={{ color: "white" }}
                            as={RouterLink}
                            to="/"
                            _hover={{ textDecoration: 'none' }}>
                            ResumeAI
                        </Text>
                    </Flex>

                    <Flex display={{ base: 'none', md: 'flex' }} flex={1} justify="flex-end" mr={10}>
                        <DesktopNav />
                    </Flex>

                    <Stack
                        flex={{ base: 1, md: 0 }}
                        justify={'flex-end'}
                        direction={'row'}
                        spacing={4}>
                        <CustomButton
                            as={RouterLink}
                            to={'/dashboard'}
                            size="sm"
                            px={6}>
                            Dashboard
                        </CustomButton>
                    </Stack>
                </Container>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('brand.500', 'white');

    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analyze', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Saved', href: '/saved-jobs' },
        { label: 'Settings', href: '/settings' },
    ];

    return (
        <Stack direction={'row'} spacing={4}>
            {navItems.map((navItem) => (
                <Box key={navItem.label}>
                    <Text
                        as={RouterLink}
                        p={2}
                        to={navItem.href}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={linkColor}
                        _hover={{
                            textDecoration: 'none',
                            color: linkHoverColor,
                        }}>
                        {navItem.label}
                    </Text>
                </Box>
            ))}
        </Stack>
    );
};

const MobileNav = () => {
    const navItems = [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Analyze', href: '/' },
        { label: 'Jobs', href: '/jobs' },
        { label: 'Saved', href: '/saved-jobs' },
        { label: 'Settings', href: '/settings' },
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
