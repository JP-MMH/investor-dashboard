import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Download, MessageCircle } from 'lucide-react';

export const ResidentSummary: React.FC = () => {
    const handleDownloadBrochure = () => {
        // Placeholder - link to actual PDF when available
        alert('Resident brochure download will be available soon!');
    };

    const handleContact = () => {
        // WhatsApp or email link
        window.open('https://wa.me/919876543210?text=Hi, I would like to know more about Mater Maria Homes', '_blank');
    };

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 lg:px-12">
                <Card className="max-w-4xl mx-auto p-12 text-center bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="font-serif font-bold text-4xl lg:text-5xl text-primary mb-4">
                            Ready to Plan Your Future?
                        </h2>
                        <p className="text-lg text-secondary/70 mb-8 max-w-2xl mx-auto">
                            You've seen the numbers. Now let's talk about making Mater Maria your home.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDownloadBrochure}
                                className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <Download size={20} />
                                Download Resident Brochure
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleContact}
                                className="flex items-center gap-3 px-8 py-4 bg-white text-primary border-2 border-primary rounded-full font-bold shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                <MessageCircle size={20} />
                                Talk to Us
                            </motion.button>
                        </div>

                        <div className="text-xs text-secondary/60 max-w-xl mx-auto">
                            <p className="italic">
                                * Figures shown are indicative and based on current assumptions.
                                Final costs and terms are subject to legal agreements and board approval.
                                Please refer to the official Information Memorandum for complete details.
                            </p>
                        </div>
                    </motion.div>
                </Card>
            </div>
        </section>
    );
};
