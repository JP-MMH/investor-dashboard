import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';

const risks = [
    {
        title: "Construction & Cost Overruns",
        mitigations: [
            "Fixed-price contracts where possible to lock in material costs.",
            "Detailed BOQ control and regular audits.",
            "Significant contingency buffer built into the financial model."
        ]
    },
    {
        title: "Occupancy Risk",
        mitigations: [
            "Phased launch to match supply with demand.",
            "Targeted marketing to NRI children of ageing parents.",
            "Partnerships with local hospitals for referrals."
        ]
    },
    {
        title: "Regulatory / Legal Risk",
        mitigations: [
            "Full legal vetting by top-tier property law firms.",
            "Clear resident agreements compliant with retirement home norms.",
            "Transparent corporate governance structure."
        ]
    },
    {
        title: "Market / Interest Rate Risk",
        mitigations: [
            "Conservative assumptions on FD (6%) and Mutual Fund (12-14%) returns.",
            "No reliance on speculative equity allocations.",
            "Debt-free project model minimizes interest rate exposure."
        ]
    },
    {
        title: "Black Swan Events (e.g., Pandemic)",
        mitigations: [
            "Cash reserves maintained for 6-12 months of operations.",
            "Ability to pivot to higher-care models if independent living demand drops.",
            "Rental fallback options for unsold inventory."
        ]
    }
];

export const RiskSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section id="risk" className="py-20 bg-white">
            <div className="container-custom">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-4">What Could Go Wrong?</h2>
                    <div className="w-16 h-1 bg-accent mx-auto mb-6" />
                    <p className="text-lg text-secondary/80 max-w-2xl mx-auto">
                        We believe in total transparency. Here are the key risks and our mitigation strategies.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {risks.map((risk, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="mb-4"
                        >
                            <Card className="p-0 overflow-hidden border-l-4 border-l-risk shadow-sm hover:shadow-md transition-shadow">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-offwhite/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <AlertCircle size={20} className="text-risk" />
                                        <span className="font-bold text-primary text-lg">{risk.title}</span>
                                    </div>
                                    <ChevronDown
                                        size={20}
                                        className={`text-secondary transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
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
                                            <div className="px-6 pb-6 pt-0 pl-14">
                                                <ul className="space-y-2">
                                                    {risk.mitigations.map((item, i) => (
                                                        <li key={i} className="text-secondary/80 flex items-start gap-2 text-sm">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-risk/60 mt-1.5 flex-shrink-0" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
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
