import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#000000', // Black
            light: '#2c2c2c',
            dark: '#000000',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFD700', // Gold
            light: '#FFE44D',
            dark: '#B29700',
            contrastText: '#000000',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#000000',
            secondary: '#666666',
        },
        gold: {
            main: '#FFD700',
            light: '#FFE44D',
            dark: '#B29700',
            contrastText: '#000000',
        },
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        h1: {
            fontSize: '3.5rem',
            fontWeight: 600,
            color: '#000000',
        },
        h2: {
            fontSize: '2.5rem',
            fontWeight: 600,
            color: '#000000',
        },
        h3: {
            fontSize: '2rem',
            fontWeight: 500,
            color: '#000000',
        },
        body1: {
            color: '#000000',
        },
        body2: {
            color: '#666666',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                },
                containedSecondary: {
                    color: '#000000',
                    '&:hover': {
                        backgroundColor: '#FFE44D',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#000000',
                    '& .MuiButton-root': {
                        '&:hover': {
                            color: '#FFD700',
                        },
                    },
                },
            },
        },
    },
});