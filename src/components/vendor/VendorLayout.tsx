import { Outlet } from "react-router-dom";
import Nav from "@/components/Nav";
import { Footer } from "../ui/footer";

export default function VendorLayout() {
    const vendorLinks = [
        { label: "Dashboard", href: "/vendor/dashboard" },
        { label: "Profile", href: "/vendor/profile" },
        { label: "Applications", href: "/vendor/applications" },
    ];

    return (
        <div className="app-container min-h-screen flex flex-col">
            <Nav links={vendorLinks} />
            {/* TODO: Add Vendor Sidebar here in the future */}
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
