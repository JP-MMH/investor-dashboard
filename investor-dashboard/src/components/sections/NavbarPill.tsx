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
            <header className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'px-4' : 'px-0'
                }`}>
                <div className={`mx-auto transition-all duration-300 ${isScrolled
                        ? 'max-w-5xl bg-mmh-investor-blue/90 backdrop-blur-md border border-mmh-gold/20 rounded-full shadow-2xl py-3 px-6'
                        : 'container-custom py-6 bg-transparent border-none'
                    }`}>
                    <div className="flex items-center justify-between">
                        {/* Brand Mark - Centered Text Pill */}
                        <div className={`flex items-center gap-3 ${isScrolled ? '' : 'bg-mmh-investor-blue/40 backdrop-blur-sm px-4 py-2 rounded-full border border-mmh-gold/10'}`}>
                            <div className="text-center leading-tight">
                                <div className="text-mmh-gold font-serif font-bold text-lg tracking-wide">Mater Maria</div>
                                <div className="text-mmh-ivory/70 text-[10px] uppercase tracking-[0.2em]">Wellness Homes</div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.href)}
                                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${isScrolled
                                            ? 'text-mmh-ivory hover:text-mmh-gold hover:bg-mmh-ivory/5'
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
