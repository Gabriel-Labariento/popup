import { Outlet } from "react-router-dom";
import Nav from "@/components/Nav";
import { Footer } from "../ui/footer";

export default function HostLayout() {
    const hostLinks = [
        { label: "Dashboard", href: "/host/dashboard" },
        { label: "Profile", href: "/host/profile" },
    ];

    return (
        <div className="app-container min-h-screen flex flex-col">
            <Nav links={hostLinks} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
