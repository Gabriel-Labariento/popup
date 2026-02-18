import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Store, Calendar, MessageSquare, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Footer } from "../ui/footer"

export function HowItWorks() {
    const steps = [
        {
            icon: <Search className="h-6 w-6" />,
            title: "Discover Opportunities",
            description: "Vendors can browse upcoming events, while Hosts can scout for unique pop-up businesses."
        },
        {
            icon: <Calendar className="h-6 w-6" />,
            title: "Connect & Apply",
            description: "Vendors apply to events with a single click. Hosts review applications and select the perfect mix."
        },
        {
            icon: <MessageSquare className="h-6 w-6" />,
            title: "Collaborate Seamlessly",
            description: "Use our built-in chat to coordinate details, logistics, and requirements before the big day."
        },
        {
            icon: <Store className="h-6 w-6" />,
            title: "Launch & Grow",
            description: "Execute successful pop-up events and build lasting business relationships."
        }
    ]

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Navigation */}
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="font-medium">Back</span>
                </Link>
            </div>

            <div className="flex-1 container mx-auto flex flex-col items-center px-4 pb-20 pt-10">
                <div className="mb-12 text-center max-w-2xl">
                    <div className="mb-6 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-primary">
                            <img src="/icon.png" alt="Logo" className="h-15 w-15" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                    </div>
                    <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Streamlining the Pop-Up Economy
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        We bridge the gap between venue hosts and pop-up vendors, making it easier than ever to organize vibrant, successful events.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid w-full max-w-4xl gap-8 sm:grid-cols-2 lg:gap-12 mb-16">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm transition-all hover:shadow-md">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                {step.icon}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="flex w-full max-w-md flex-col gap-4">
                    <Button size="lg" className="w-full" asChild>
                        <Link to="/?step=role-selection">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    )
}
