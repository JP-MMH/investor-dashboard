import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
    return (
        <div
            className={cn("bg-white rounded-2xl shadow-soft p-6 md:p-8 border border-border", className)}
            {...props}
        >
            {children}
        </div>
    );
};
