import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Scenario', href: '#top' },
    { name: 'Allocation', href: '#allocation' },
    { name: 'Safety', href: '#safety' },
    { name: 'Comparison', href: '#comparison' },
    { name: 'Risks', href: '#risk' },
];

export const NavbarPill: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Sticky Header Island with Liquid Glass Effect */}
            <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-out px-4 ${isScrolled ? 'top-3' : 'top-6'
                }`}>
                <div className={`mx-auto transition-all duration-500 ease-out relative ${isScrolled
                        ? 'max-w-7xl bg-mmh-investor-blue/70 backdrop-blur-xl border border-mmh-gold/30 rounded-full shadow-2xl shadow-mmh-gold/10 py-2.5 px-6'
                        : 'max-w-7xl py-4 bg-transparent border-none'
                    }`}>
                    {/* Subtle specular highlight overlay for glass effect */}
                    {isScrolled && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    )}

                    <div className="flex items-center justify-between h-10 relative z-10">
                        {/* Brand Mark - Left on Desktop, Center on Mobile */}
                        <div className="lg:relative lg:left-0 lg:top-0 lg:transform-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:translate-x-0 lg:translate-y-0">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`flex flex-col items-center justify-center px-4 sm:px-6 py-2 rounded-full transition-all duration-500 lg:cursor-default ${isScrolled ? 'bg-transparent scale-90' : 'bg-mmh-investor-blue/30 backdrop-blur-md border border-mmh-gold/10'
                                    }`}
                            >
                                <div className="text-mmh-gold font-serif font-bold text-base sm:text-lg md:text-xl tracking-wide leading-none whitespace-nowrap">Mater Maria</div>
                                <div className="text-mmh-ivory/80 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.25em] leading-none mt-1">Wellness Homes</div>
                            </button>
                        </div>

                        {/* Desktop Navigation Links */}
                        <nav className="hidden lg:flex items-center gap-1 ml-auto">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => scrollToSection(link.href)}
                                    className={`px-3 lg:px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 ${isScrolled
                                            ? 'text-mmh-ivory/80 hover:text-mmh-gold hover:bg-mmh-ivory/5 hover:shadow-lg hover:shadow-mmh-gold/10'
                                            : 'text-mmh-gold hover:text-mmh-ivory hover:bg-mmh-gold/10 hover:shadow-lg hover:shadow-mmh-gold/20'
                                        } active:scale-95 touch-target`}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </nav>

                        {/* Mobile Menu Button (visible only on mobile) */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden ml-auto p-2 text-mmh-gold hover:text-mmh-ivory transition-colors touch-target"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-mmh-investor-blue/95 backdrop-blur-xl pt-24 px-6">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => scrollToSection(link.href)}
                                className="w-full text-left px-6 py-4 text-lg font-bold uppercase tracking-wider text-mmh-gold hover:text-mmh-ivory hover:bg-mmh-gold/10 rounded-lg transition-all active:scale-95 touch-target"
                            >
                                {link.name}
                            </button>
                        ))}
                    </nav>
                </div>
            )}
        </>
    );
};
