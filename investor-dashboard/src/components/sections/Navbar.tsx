import React, { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const navLinks = [
    { name: 'Summary', href: '#snapshot' },
    { name: 'Model', href: '#allocation' },
    { name: 'Stress Test', href: '#stress-test' },
    { name: 'Comparison', href: '#comparison' },
    { name: 'Risks', href: '#risk' },
    { name: 'Team', href: '#team' },
    { name: 'FAQ', href: '#faq' },
];

export const Navbar: React.FC = () => {
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
        setIsMobileMenuOpen(false);
        const element = document.querySelector(href);
        if (element) {
            const navHeight = 80; // Approx header height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <nav className={cn(
            "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
            isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        )}>
            <div className="container-custom flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-accent font-serif text-xl font-bold">
                        M
                    </div>
                    <span className={cn(
                        "font-serif text-xl font-bold tracking-wide",
                        isScrolled ? "text-primary" : "text-primary"
                    )}>
                        Mater Maria
                    </span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.href)}
                            className="text-sm font-medium text-secondary hover:text-accent transition-colors"
                        >
                            {link.name}
                        </button>
                    ))}
                    <Button
                        variant="primary"
                        className="flex items-center gap-2 px-5 py-2 text-sm"
                        onClick={() => scrollToSection('#downloads')}
                    >
                        <Download size={16} />
                        Investor Pack
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden text-primary"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-border p-6 flex flex-col gap-4 lg:hidden">
                    {navLinks.map((link) => (
                        <button
                            key={link.name}
                            onClick={() => scrollToSection(link.href)}
                            className="text-left text-base font-medium text-secondary hover:text-accent py-2"
                        >
                            {link.name}
                        </button>
                    ))}
                    <Button
                        variant="primary"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => scrollToSection('#downloads')}
                    >
                        <Download size={16} />
                        Download Investor Pack
                    </Button>
                </div>
            )}
        </nav>
    );
};
