import React from 'react';
import { Flag, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReportButtonProps {
    type: 'event' | 'host' | 'vendor';
    id: string;
    name: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
    label?: string; // Optional custom label, defaults to "Report"
}

export function ReportButton({ type, id, name, variant = 'ghost', size = 'sm', className, label = "Report" }: ReportButtonProps) {
    const adminEmail = "gabrielmatthew.labariento@gmail.com";

    const getSubject = () => {
        switch (type) {
            case 'event':
                return `Report Event: ${name} (ID: ${id})`;
            case 'host':
                return `Report Host: ${name} (ID: ${id})`;
            case 'vendor':
                return `Report Vendor: ${name} (ID: ${id})`;
            default:
                return `Report Suspicious Activity`;
        }
    };

    const getBody = () => {
        return `Hi Admin,%0D%0A%0D%0AI would like to report the following ${type}:%0D%0A%0D%0AName: ${name}%0D%0AID: ${id}%0D%0A%0D%0AReason for report:%0D%0A(Please describe the issue here)%0D%0A%0D%0AThank you.`;
    };

    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(getSubject())}&body=${getBody()}`;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={variant}
                        size={size}
                        className={`text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ${className}`}
                        asChild
                    >
                        <a href={mailtoLink}>
                            <Flag size={14} className="mr-1.5" />
                            {label}
                        </a>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Report this {type} to admin</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
