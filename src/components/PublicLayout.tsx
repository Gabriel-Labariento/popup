import { Outlet, Link } from "react-router-dom";
import { Footer } from "./ui/footer";
import { ArrowLeft } from "lucide-react";

export function PublicLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b backdrop-blur-lg bg-background/95 supports-backdrop-filter:bg-background/80">
                <div className="container mx-auto flex h-14 items-center px-4">
                    <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                </div>
            </header>
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
