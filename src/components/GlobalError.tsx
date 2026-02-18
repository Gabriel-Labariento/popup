
import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Footer } from './ui/footer';

export const GlobalError = () => {
    const error = useRouteError();
    let errorMessage: string;

    if (isRouteErrorResponse(error)) {
        // page not found or other http errors caught by router
        errorMessage = error.statusText || error.data?.message || "Unknown Error";
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        errorMessage = 'An unexpected error occurred.';
    }

    console.error(error);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                    <AlertCircle className="h-10 w-10 text-red-600" />
                </div>

                <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
                    Something went wrong
                </h1>

                <p className="mb-8 max-w-md text-muted-foreground">
                    We encountered an error while processing your request.
                    <br />
                    <span className="font-mono text-xs bg-muted p-1 rounded mt-2 inline-block">
                        {errorMessage}
                    </span>
                </p>

                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reload Page
                    </Button>

                    <Button asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
};
