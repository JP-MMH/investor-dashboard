import React, { useState, useEffect } from 'react';

const navLinks = [
    { name: 'Scenario', href: '#top' },
    { name: 'Allocation', href: '#allocation' },
    { name: 'Safety', href: '#safety' },
    { name: 'Comparison', href: '#comparison' },
    { name: 'Risks', href: '#risk' },
];

export const NavbarPill: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (href: string) => {
        const element = document.querySelector(href === '#top' ? 'body' : href);
        if (element) {
            const navHeight = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <>
            {/* Sticky Header Island */}
            <header className={`fixed top-6 left-0 right-0 z-50 transition-all duration-300 px-4`}>
                <div className={`mx-auto transition-all duration-300 relative ${isScrolled
                    ? 'max-w-5xl bg-mmh-investor-blue/80 backdrop-blur-xl border border-mmh-gold/20 rounded-full shadow-2xl py-3 px-6'
                    : 'max-w-6xl py-4 bg-transparent border-none'
                    }`}>
                    <div className="flex items-center justify-between h-10">
                        {/* Brand Mark - Centered Text Pill */}
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className={`flex flex-col items-center justify-center px-6 py-2 rounded-full transition-all duration-300 ${isScrolled ? 'bg-transparent' : 'bg-mmh-investor-blue/30 backdrop-blur-md border border-mmh-gold/10'
                                }`}>
                                <div className="text-mmh-gold font-serif font-bold text-xl tracking-wide leading-none">Mater Maria</div>
                                <div className="text-mmh-ivory/80 text-[9px] uppercase tracking-[0.25em] leading-none mt-1">Wellness Homes</div>
                            </div>
                        </div>

                        {/* Spacer for left side (if needed later) */}
                        <div className="hidden md:block w-20"></div>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1 ml-auto">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.href)}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${isScrolled
                                        ? 'text-mmh-ivory/80 hover:text-mmh-gold hover:bg-mmh-ivory/5'
                                        : 'text-mmh-gold hover:text-mmh-ivory hover:bg-mmh-gold/10'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
};
