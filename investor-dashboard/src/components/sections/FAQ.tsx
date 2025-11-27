import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Card } from '../ui/Card';

const faqs = [
    {
        q: "What happens if the project does not reach full occupancy?",
        a: "The financial model is stress-tested to be viable even at 60-70% occupancy. Additionally, we have rental fallback options and can pivot to higher-care models which have consistent demand."
    },
    {
        q: "What exactly is guaranteed and what is projected?",
        a: "Guaranteed: Land ownership and the priority of resident refunds. Projected: The 8.68% IRR and final exit valuation, which depend on market conditions."
    },
    {
        q: "What takes priority: resident refunds or investor returns?",
        a: "Resident refunds are senior obligations. Investor distributions are calculated only after full provisioning for refund liabilities."
    },
    {
        q: "How often will I receive updates and reports?",
        a: "Investors receive a quarterly dashboard update covering occupancy, financial health, and project milestones, plus an annual audited financial statement."
    },
    {
        q: "Can I exit early or transfer my investment?",
        a: "The base case is a 15-year horizon. Early exit is possible via secondary transfer to approved buyers, subject to board approval and a lock-in period (details in term sheet)."
    },
    {
        q: "What happens in a pandemic-style event?",
        a: "We maintain 6-12 months of operational cash reserves. Senior living communities often see higher demand during health crises due to the safety and medical support they offer."
    },
    {
        q: "Is my investment secured against land or only cash flows?",
        a: "The investment is equity in the project company, which owns the land and assets. It is not a debt instrument secured by a specific mortgage, but you own a share of the underlying asset."
    },
    {
        q: "How conservative are the return assumptions?",
        a: "Extremely conservative. We assume 6% on FDs and 12-14% on Mutual Funds, with minimal real estate appreciation factored into the shutdown analysis."
    }
];

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-20 bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                            <Card className="p-0 overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-offwhite/50 transition-colors"
                                >
                                    <span className="font-bold text-primary text-lg pr-8">{item.q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-secondary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="px-6 pb-6 pt-0 text-secondary/80 leading-relaxed border-t border-border/50">
                                                <div className="pt-4">{item.a}</div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
