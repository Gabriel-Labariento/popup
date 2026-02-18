
import { ShieldCheck, AlertTriangle, MessageSquare, Briefcase, Lock, UserCheck, Flag, Mail } from "lucide-react";

export function ScamSafetyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="bg-primary/5 py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <ShieldCheck className="h-16 w-16 mx-auto text-primary mb-6" />
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Stay Safe on Pop Up</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your safety is our top priority. Learn how to protect yourself and your business from scams and fraudulent activities.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 space-y-16 max-w-5xl">

                {/* General Safety Tips */}
                <section>
                    <h2 className="text-3xl font-bold mb-8 text-center">General Safety Tips</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <Lock className="h-8 w-8 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Keep Communication On-Platform</h3>
                            <p className="text-muted-foreground">
                                Always communicate through the Pop Up messaging system. This provides a record of conversations and helps us assist you if disputes arise.
                            </p>
                        </div>
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <UserCheck className="h-8 w-8 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Verify Identities</h3>
                            <p className="text-muted-foreground">
                                Check profiles, reviews, and past event history before committing to a booking or payment.
                            </p>
                        </div>
                        <div className="bg-card border rounded-lg p-6 shadow-sm">
                            <AlertTriangle className="h-8 w-8 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Trust Your Instincts</h3>
                            <p className="text-muted-foreground">
                                If an offer sounds too good to be true, it probably is. Be cautious of high-pressure tactics or unusual requests.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Role-Specific Advice */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* For Vendors */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Briefcase className="h-8 w-8 text-primary" />
                            <h2 className="text-2xl font-bold">For Vendors</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <Flag className="h-5 w-5 text-destructive shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Beware of Overpayment Scams</h4>
                                    <p className="text-sm text-muted-foreground">Never accept a check for more than the agreed amount and be asked to wire back the difference.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <Flag className="h-5 w-5 text-destructive shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Verify Event Details</h4>
                                    <p className="text-sm text-muted-foreground">Confirm the event location and organizer details independently if possible.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <Flag className="h-5 w-5 text-destructive shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Secure Payments</h4>
                                    <p className="text-sm text-muted-foreground">Avoid paying via wire transfer, gift cards, or cryptocurrency. These methods are hard to trace and recover.</p>
                                </div>
                            </li>
                        </ul>
                    </section>

                    {/* For Hosts */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 mb-4">
                            <MessageSquare className="h-8 w-8 text-primary" />
                            <h2 className="text-2xl font-bold">For Hosts</h2>
                        </div>
                        <ul className="space-y-4">
                            <li className="flex gap-3 items-start">
                                <Flag className="h-5 w-5 text-destructive shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Fake Vendor Profiles</h4>
                                    <p className="text-sm text-muted-foreground">Be wary of vendors with incomplete profiles or who refuse to provide portfolio samples.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <Flag className="h-5 w-5 text-destructive shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Phishing Attempts</h4>
                                    <p className="text-sm text-muted-foreground">Do not click on suspicious links sent via chat that ask for your login credentials.</p>
                                </div>
                            </li>
                            <li className="flex gap-3 items-start">
                                <Flag className="h-5 w-5 text-destructive shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold">Last-Minute Changes</h4>
                                    <p className="text-sm text-muted-foreground">Be cautious of vendors who demand major changes to the agreement at the last minute.</p>
                                </div>
                            </li>
                        </ul>
                    </section>
                </div>

                {/* Reporting Section */}
                <section className="bg-muted/50 rounded-lg p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Spot something suspicious?</h2>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        If you encounter any suspicious activity or believe you have been the target of a scam, please report it to us immediately.
                        Safe communities rely on proactive members like you.
                    </p>
                    <a
                        href="mailto:gabrielmatthew.labariento@gmail.com"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors"
                    >
                        <Mail className="h-4 w-4" />
                        Report a Concern
                    </a>
                </section>
            </div>
        </div>
    );
}
