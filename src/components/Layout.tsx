import { Container, Flex, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Container p={8} maxW="container.xl" minH="100vh" display="flex" flexDir="column">
      <Flex direction="column" grow={1} justifyContent="center">
        <Text fontSize="4xl" fontWeight="bold" mb={5}>
          Dashboard
        </Text>
        <Flex direction="column" justifyContent="center" alignItems="center">
          {children}
        </Flex>
      </Flex>
    </Container>
  );
};
