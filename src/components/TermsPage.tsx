
export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground">
                        By accessing or using Pop Up, you agree to be bound by these Terms of Service and all applicable laws and regulations.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. Platform Rules</h2>
                    <div className="text-muted-foreground">
                        <p className="mb-2">Users must NOT:</p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Use the platform for any illegal purpose.</li>
                            <li>Harass, abuse, or harm another person.</li>
                            <li>Post false or misleading information.</li>
                            <li>Interfere with the proper working of the platform.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
                    <p className="text-muted-foreground">
                        Hosts are responsible for the accuracy of their event listings and for providing a safe venue.
                        Vendors are responsible for the quality of their products and for complying with local regulations.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Liability Disclaimer</h2>
                    <p className="text-muted-foreground">
                        Pop Up is a platform connecting Hosts and Vendors. We are not a party to any transaction between users.
                        We are not liable for any damages arising from your use of the platform or from any interactions with other users.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
                    <p className="text-muted-foreground">
                        We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of the modified terms.
                    </p>
                </section>

                <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
