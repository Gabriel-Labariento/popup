import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client/supabase";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, ShoppingBag, Check, Loader2 } from "lucide-react";
import type { UserRole } from "@/types";

export const RoleSelectionPage = () => {
    const { session, loading: authLoading } = UserAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [saving, setSaving] = useState(false);

    if (authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-rose-600" size={48} />
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    // If user already has a role, redirect to their dashboard
    const existingRole = session.user.user_metadata.role as UserRole | undefined;
    if (existingRole) {
        return <Navigate to={existingRole === "HOST" ? "/host/dashboard" : "/vendor/dashboard"} replace />;
    }

    const handleContinue = async () => {
        if (!selectedRole) return;

        setSaving(true);
        const { error } = await supabase.auth.updateUser({
            data: { role: selectedRole },
        });

        if (error) {
            setSaving(false);
            return;
        }

        navigate(
            selectedRole === "HOST" ? "/host/dashboard" : "/vendor/dashboard",
            { replace: true }
        );
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-5xl">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
                            One more step
                        </h2>
                        <p className="text-balance text-lg text-muted-foreground">
                            Select the option that best describes you
                        </p>
                    </div>

                    {/* Role Cards */}
                    <div className="mb-8 grid gap-6 md:grid-cols-2">
                        {/* Event Host Card */}
                        <Card
                            className={`relative cursor-pointer border-2 p-8 transition-all duration-200 ${
                                selectedRole === "HOST"
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border hover:border-primary/50 hover:shadow-sm"
                            }`}
                            onClick={() => setSelectedRole("HOST")}
                        >
                            {selectedRole === "HOST" && (
                                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                    <Check className="h-5 w-5 text-primary-foreground" />
                                </div>
                            )}
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                <Calendar className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-foreground">I&apos;m an Event Host</h3>
                            <p className="mb-6 leading-relaxed text-muted-foreground">
                                Post your event, review vendor applications, and find the right pop-up partners—fast.
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">Perfect for:</p>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Student organizations</li>
                                    <li>• Bazaar organizers</li>
                                    <li>• Community events</li>
                                </ul>
                            </div>
                        </Card>

                        {/* Pop-Up Vendor Card */}
                        <Card
                            className={`relative cursor-pointer border-2 p-8 transition-all duration-200 ${
                                selectedRole === "VENDOR"
                                    ? "border-primary bg-primary/5 shadow-md"
                                    : "border-border hover:border-primary/50 hover:shadow-sm"
                            }`}
                            onClick={() => setSelectedRole("VENDOR")}
                        >
                            {selectedRole === "VENDOR" && (
                                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                                    <Check className="h-5 w-5 text-primary-foreground" />
                                </div>
                            )}
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                                <ShoppingBag className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="mb-3 text-2xl font-bold text-foreground">I&apos;m a Pop-Up Vendor</h3>
                            <p className="mb-6 leading-relaxed text-muted-foreground">
                                Discover events, apply to booths, and grow your business without relying on word of mouth.
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-foreground">Perfect for:</p>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Food & beverage</li>
                                    <li>• Merch & apparel</li>
                                    <li>• Art & crafts</li>
                                </ul>
                            </div>
                        </Card>
                    </div>

                    {/* Continue Button */}
                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            onClick={handleContinue}
                            disabled={!selectedRole || saving}
                            className="w-full md:w-auto shadow-md transition-all hover:scale-105 active:scale-95"
                        >
                            {saving ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
