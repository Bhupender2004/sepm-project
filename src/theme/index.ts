import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6', // Violet 500
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065',
    },
    accent: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
    },
  },
  fonts: {
    heading: `'Outfit', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
        color: mode('gray.800', 'whiteAlpha.900')(props),
        backgroundImage: mode(
          'radial-gradient(at 0% 0%, hsla(250,100%,94%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(220,100%,96%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(340,100%,96%,1) 0, transparent 50%)',
          'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)'
        )(props),
        backgroundAttachment: 'fixed',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'full',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'brand'
            ? 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
            : undefined,
          color: 'white',
          _hover: {
            bg: props.colorScheme === 'brand'
              ? 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)'
              : undefined,
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            transform: 'translateY(0)',
          },
        }),
        glass: (props: any) => ({
          bg: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: mode('gray.800', 'white')(props),
          _hover: {
            bg: 'rgba(255, 255, 255, 0.25)',
          },
        }),
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: '3xl',
        },
      },
      variants: {
        glass: (props: any) => ({
          container: {
            bg: mode('rgba(255, 255, 255, 0.6)', 'rgba(26, 32, 44, 0.6)')(props),
            backdropFilter: 'blur(16px)',
            border: '1px solid',
            borderColor: mode('whiteAlpha.400', 'whiteAlpha.100')(props),
            boxShadow: mode(
              '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
              '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            )(props),
          },
        }),
      },
    },
    Input: {
      variants: {
        filled: (props: any) => ({
          field: {
            bg: mode('white', 'whiteAlpha.50')(props),
            backdropFilter: 'blur(5px)',
            border: '1px solid',
            borderColor: mode('gray.200', 'transparent')(props),
            _hover: {
              bg: mode('gray.50', 'whiteAlpha.100')(props),
            },
            _focus: {
              bg: mode('white', 'gray.800')(props),
              borderColor: 'brand.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-500)',
            },
          },
        }),
      },
      defaultProps: {
        variant: 'filled',
      },
    },
  },
});

export default theme;

