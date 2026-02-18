import { Link } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
            <p className="text-muted-foreground mb-8">
                We're here to help! If you have any questions, concerns, or need to report an issue, please reach out to us using the methods below.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">Email Support</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        For general inquiries, account support, or to report a violation of our terms.
                    </p>
                    <a href="mailto:gabrielmatthew.labariento@gmail.com">
                        <Button className="w-full text-xs sm:text-sm">
                            gabrielmatthew.labariento@gmail.com
                        </Button>
                    </a>
                </div>

                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <MessageCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-xl font-semibold">In-App Chat</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                        If you are logged in, you can chat with your hosts or vendors directly through the platform.
                    </p>
                    <Link to="/login">
                        <Button variant="outline" className="w-full">
                            Login to Chat
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-4">Reporting Issues</h2>
                <p className="text-muted-foreground">
                    To report a technical issue or a safety concern:
                </p>
                <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-2">
                    <li>
                        <strong>Technical Bugs:</strong> Please email support with a description of the issue and screenshots if possible.
                    </li>
                    <li>
                        <strong>Safety Concerns:</strong> Immediately contact support if you encounter any suspicious activity or harassment.
                    </li>
                </ul>
            </div>
        </div>
    );
}
