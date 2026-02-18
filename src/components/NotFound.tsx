
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Footer } from './ui/footer';

export const NotFound = () => {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <FileQuestion className="h-12 w-12 text-muted-foreground" />
                </div>

                <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
                    Page not found
                </h1>

                <p className="mb-8 max-w-md text-muted-foreground">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>

                <Button asChild size="lg">
                    <Link to="/dashboard">
                        <Home className="mr-2 h-5 w-5" />
                        Back to Dashboard
                    </Link>
                </Button>
            </div>
            <Footer />
        </div>
    );
};
