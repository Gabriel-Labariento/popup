import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
    return (
        <footer className={cn("border-t py-6 md:py-0 bg-background/95 backdrop-blur-lg supports-backdrop-filter:bg-background/80", className)}>
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} Pop Up. All rights reserved.
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <Link to="/privacy" className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4 hover:text-foreground">
                        Privacy
                    </Link>
                    <Link to="/terms" className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4 hover:text-foreground">
                        Terms
                    </Link>
                    <Link to="/contact" className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4 hover:text-foreground">
                        Contact
                    </Link>
                    <Link to="/scam-safety" className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4 hover:text-foreground">
                        Scam Safety
                    </Link>
                </div>
            </div>
        </footer>
    );
}
