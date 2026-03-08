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
      50: '#F0F7FF', // Lightest theme color
      100: '#E6F0FF',
      200: '#C2E3FF',
      300: '#9CD5FF', // Requested Light Blue
      400: '#8BCBFF',
      500: '#7AAACE', // Requested Darker Blue (Primary)
      600: '#6999BB',
      700: '#5888A8',
      800: '#477795',
      900: '#366682',
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
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('#F0F7FF', 'gray.900')(props), // Requested Background
        color: mode('gray.800', 'whiteAlpha.900')(props),
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '500',
        borderRadius: 'lg',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'brand' ? '#7AAACE' : undefined,
          color: props.colorScheme === 'brand' ? '#F0F7FF' : 'white',
          boxShadow: props.colorScheme === 'brand' ? 'sm' : undefined,
          _hover: {
            bg: props.colorScheme === 'brand' ? '#9CD5FF' : undefined,
            transform: 'translateY(-1px)',
            boxShadow: 'md',
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
          borderRadius: 'xl',
          boxShadow: 'sm',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: 'md',
          }
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

