/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // === INVESTOR VERTICAL - Palette 1: Spiritual depth, trust, night-time calmness ===
                'mmh-investor-blue': '#102333',  // Midnight Blue - Primary for investor pages
                'mmh-gold': '#D4B66A',           // Gold - Highlights and accents
                'mmh-ivory': '#F5F2E8',          // Ivory - Background
                'mmh-charcoal': '#1A1A1A',       // Charcoal - Dark text

                // === RESIDENT/LIVING VERTICAL - Separate palette (DO NOT USE for investors) ===
                heritage: '#2F4F4F',             // Deep Heritage Green - LIVING pages only
                cloud: '#FAF7F0',                // Cloud Off-White
                terra: '#A65F43',                // Terracotta Accent
                sage: '#6E8D5E',                 // Sage Green
                deepbrown: '#5C4033',            // Deep Brown
                maroon: '#8B3A3A',               // Warm Maroon
                coolgrey: '#A0A9AB',             // Cool Grey

                // === LEGACY ALIASES (Updated to Investor palette) ===
                primary: "#102333",              // Midnight Blue (was green)
                secondary: "#0D1B26",            // Darker Midnight Blue
                accent: "#D4B66A",               // Gold (updated from #CBA35C)
                highlight: "#E8D9B4",            // Light Gold
                offwhite: "#F5F2E8",             // Ivory
                border: "#E0DED7",               // Keep border
                risk: "#B9373C",                 // Keep risk color
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
