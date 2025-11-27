import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary py-12 text-white/60 text-sm">
            <div className="container-custom text-center space-y-4">
                <p>&copy; 2025 Mater Maria Wellness Homes Pvt Ltd. All rights reserved.</p>
                <p className="max-w-2xl mx-auto">
                    Numbers shown are illustrative and based on conservative, CA-reviewed projections. This is not a prospectus or an offer to sell securities. Investment in real estate and private equity involves risks.
                </p>
            </div>
        </footer>
    );
};
