'use client';
import React from 'react';
import {
  Button,
  Heading,
  Flex,
  Image,
  Spacer,
  Container,
} from '@chakra-ui/react';
import { Link } from '@chakra-ui/next-js';
import NextLink from 'next/link';
import { links } from '@/constants/links';

export const Header = () => {
  return (
    <Container maxW="container.lg">
      <Flex
        maxWidth="container.lg"
        align="center"
        mx="auto"
        pt={4}
        flexWrap="wrap"
      >
        <Link
          href={links.HomePage}
          color="white"
          as={NextLink}
          _hover={{ textDecoration: 'none' }}
        >
          <Flex gap={1} alignItems="center">
            <Image
              src="/images/logo.svg"
              alt="Cannon Logo"
              boxSize="48px"
              objectFit="cover"
            />
            <Heading as="h1" fontWeight="bold" size="lg">
              CANNON
            </Heading>
          </Flex>
        </Link>
        <Spacer />
        <Flex gap={8} alignItems="center" flexWrap="wrap">
          <Link
            href={links.EXPLORE}
            color="white"
            as={NextLink}
            _hover={{ textDecoration: 'none' }}
            textTransform="uppercase"
            fontFamily="var(--font-miriam)"
          >
            Explore
          </Link>
          <Link
            href={links.DOC}
            color="white"
            as={NextLink}
            _hover={{ textDecoration: 'none' }}
            textTransform="uppercase"
            fontFamily="var(--font-miriam)"
          >
            Docs
          </Link>
          <Link href={links.GET_STARTED} color="white" as={NextLink}>
            <Button colorScheme="teal" size="sm">
              Get Started
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
};
