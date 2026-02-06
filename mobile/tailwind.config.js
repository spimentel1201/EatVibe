/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF5722',
                    50: '#FFE8E0',
                    100: '#FFCDB8',
                    200: '#FFB299',
                    300: '#FF977A',
                    400: '#FF7C5B',
                    500: '#FF5722',
                    600: '#E64A19',
                    700: '#D84315',
                    800: '#BF360C',
                    900: '#A62D08',
                },
                secondary: {
                    DEFAULT: '#FFC107',
                    50: '#FFF9E6',
                    100: '#FFF3CC',
                    200: '#FFE699',
                    300: '#FFD966',
                    400: '#FFCC33',
                    500: '#FFC107',
                    600: '#E6AD06',
                    700: '#CC9A05',
                    800: '#B38604',
                    900: '#997303',
                },
                success: '#4CAF50',
                error: '#F44336',
                warning: '#FF9800',
                info: '#2196F3',
                background: {
                    DEFAULT: '#FFFFFF',
                    secondary: '#F5F5F5',
                    tertiary: '#EEEEEE',
                },
                text: {
                    primary: '#212121',
                    secondary: '#757575',
                    disabled: '#BDBDBD',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'xs': ['12px', { lineHeight: '16px' }],
                'sm': ['14px', { lineHeight: '20px' }],
                'base': ['16px', { lineHeight: '24px' }],
                'lg': ['18px', { lineHeight: '28px' }],
                'xl': ['20px', { lineHeight: '28px' }],
                '2xl': ['24px', { lineHeight: '32px' }],
                '3xl': ['30px', { lineHeight: '36px' }],
                '4xl': ['36px', { lineHeight: '40px' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
            boxShadow: {
                'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
            },
        },
    },
    plugins: [],
}
