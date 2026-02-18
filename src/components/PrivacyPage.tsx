
export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-2">1. Data We Collect</h2>
                    <p className="text-muted-foreground">
                        We collect information you provide directly to us when you create an account, create or apply to events, or communicate with us.
                        This may include your name, email address, and business details.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">2. How We Use Your Data</h2>
                    <p className="text-muted-foreground">
                        We use your data to:
                    </p>
                    <ul className="list-disc pl-5 text-muted-foreground mt-2 space-y-1">
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Process transactions and send related information.</li>
                        <li>Facilitate communication between Hosts and Vendors.</li>
                        <li>Send administrative messages, support responses, and security alerts.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
                    <p className="text-muted-foreground">
                        We do not sell your personal data. We share data only as necessary to provide our services (e.g., sharing Vendor profiles with Hosts they apply to)
                        or when required by law.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">4. Account Deletion</h2>
                    <p className="text-muted-foreground">
                        You have the right to request deletion of your account and personal data. To delete your account, please contact our support team at <a href="mailto:gabrielmatthew.labariento@gmail.com" className="text-primary hover:underline">gabrielmatthew.labariento@gmail.com</a> or use the delete account option in your profile settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-2">5. Contact Us</h2>
                    <p className="text-muted-foreground">
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:gabrielmatthew.labariento@gmail.com" className="text-primary hover:underline">gabrielmatthew.labariento@gmail.com</a>.
                    </p>
                </section>

                <p className="text-sm text-muted-foreground mt-8">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </div>
    );
}
