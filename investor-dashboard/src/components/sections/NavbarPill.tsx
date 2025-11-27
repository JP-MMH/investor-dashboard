import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

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
            setIsScrolled(window.scrollY > 100);
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
        <div className={cn(
            "fixed top-6 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none",
            isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}>
            <div className="backdrop-blur-md text-white rounded-full shadow-lg px-2 py-1.5 flex items-center gap-1 pointer-events-auto border border-white/20" style={{ background: 'rgba(212, 175, 55, 0.95)' }}>
                {navLinks.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => scrollToSection(link.href)}
                        className="px-4 py-2 rounded-full text-xs font-medium hover:bg-white/10 transition-colors"
                    >
                        {link.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
