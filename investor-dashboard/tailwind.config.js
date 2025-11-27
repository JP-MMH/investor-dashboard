/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Strict Brand Palette - Mater Maria Homes
                heritage: '#2F4F4F',    // Deep Heritage Green - trust, stability, heritage
                cloud: '#FAF7F0',       // Cloud Off-White - softness, safety, warmth
                terra: '#A65F43',       // Terracotta Accent - earth, groundedness, warmth
                sage: '#6E8D5E',        // Sage Green - health, nature, calm progress
                deepbrown: '#5C4033',   // Deep Brown - sturdiness, reliability
                gold: '#D4AF37',        // Gold Accent - premium, value, reward
                maroon: '#8B3A3A',      // Warm Maroon - caution without fear
                coolgrey: '#A0A9AB',    // Cool Grey - technical, rational

                // Legacy colors (keep for Investor page compatibility)
                primary: "#103B32",
                secondary: "#153F35",
                accent: "#CBA35C",
                highlight: "#E8D3A3",
                offwhite: "#F8F4EC",
                border: "#E0DED7",
                risk: "#B9373C",
            },
            fontFamily: {
                heading: ['Playfair Display', 'serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
                // Legacy aliases
                serif: ['Playfair Display', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            boxShadow: {
                soft: '0 8px 20px rgba(47,79,79,0.08)',
                deep: '0 12px 24px rgba(0,0,0,0.15)',
                insetSoft: 'inset 0 0 0 1px rgba(160,169,171,0.12)',
                // Legacy
                'soft-legacy': '0 10px 30px rgba(0, 0, 0, 0.06)',
            },
            borderRadius: {
                xl: '20px',
                xxl: '32px',
                // Legacy
                '2xl': '1rem',
            },
            spacing: {
                '18': '4.5rem',
            }
        },
    },
    plugins: [],
}
