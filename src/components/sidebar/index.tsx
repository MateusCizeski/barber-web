import { ReactNode } from "react";
import { IconButton, Box, CloseButton, Flex, Icon, Drawer, DrawerContent, useColorModeValue, Text, useDisclosure, BoxProps, FlexProps } from "@chakra-ui/react";
import { FiScissors, FiClipboard, FiSettings, FiMenu } from 'react-icons/fi';
import { IconType } from "react-icons";
import Link from "next/link";

interface LinkItemProps {
    name: string;
    icon: IconType;
    route: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Agenda', icon: FiScissors, route: '/dashboard' },
    { name: 'Cortes', icon: FiClipboard, route: '/haircuts' },
    { name: 'Minha conta', icon: FiSettings, route: '/profile' },
];

export function Sidebar({ children }: { children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Box minH="100vh" bg="barber.900">
            <SideBarContent onClose={onClose} display={{ base: 'none', md: 'block' }}/>
            <Drawer autoFocus={false} isOpen={isOpen} placement="left" returnFocusOnClose={false} onOverlayClick={onClose} size="full">
                <DrawerContent>
                    <SideBarContent onClose={() => onClose()} />
                </DrawerContent>
            </Drawer>
            <MobileNav display={{ base: 'flex', md: 'none'  }} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p={4}>
                {children}
            </Box>
        </Box>
    )
}

interface SideBarProps extends BoxProps {
    onClose: () => void;
}

const SideBarContent = ({ onClose, ...rest }: SideBarProps) => {
    return (
        <Box bg="barber.400" borderRight="1px" borderRightColor={useColorModeValue('gray.200', 'gray.700')} w={{ base: 'full', md: 60 }} pos="fixed" h="full" {...rest}>
            <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
                <Link href="/dashboard">
                    <Flex cursor="pointer" userSelect="none" flexDirection="row">
                        <Text fontSize="2x1" fontFamily="monospace" fontWeight="bold">Barber</Text>
                        <Text fontSize="2x1" fontFamily="monospace" fontWeight="bold">PRO</Text>
                    </Flex>
                </Link>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose}/>
            </Flex>

            {LinkItems.map((link) => (
                <NavItem icon={link.icon} route={link.route} key={link.name}>
                    { link.name }
                </NavItem>
            ))}
        </Box>
    )
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactNode;
    route: string;
}

const NavItem = ({ icon, children, route, ...rest }: NavItemProps) => {
    return (
    <Link href={route} style={{ textDecoration: 'none' }}>
        <Flex align="center" p="4" mx="4" borderRadius="lg" role="group" cursor="pointer" _hover={{ bg: "barber.900", color: 'white' }} { ...rest }>
            { icon && (
                <Icon mr="4" fontSize="16" as={icon} _groupHover={{ color: 'white' }}/>
            )}
            {children}
        </Flex>
    </Link>
    )
}

interface MobileProps extends FlexProps {
    onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex 
            ml={{ base: 0, md: 60}} 
            px={{ base: 4, md: 24}} 
            height="20" 
            alignItems="center" 
            bg={useColorModeValue('white', 'gray.700')} 
            borderBottomWidth="1px" 
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent="flex-start"
            {...rest}
        >
            <IconButton 
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Flex flexDirection="row">
                <Text ml={8} fontSize="2x1" fontFamily="monospace" fontWeight="bold">Barber</Text>
                <Text fontSize="2x1" fontFamily="monospace" fontWeight="bold">PRO</Text>
            </Flex>

        </Flex>
    )
}