import { useState } from "react";
import { Navigate } from "react-router-dom";
import { WelcomeStep } from "./welcome-step";
import { RoleSelectionStep } from "./role-selection-step";
import { BenefitsStep } from "./benefits-page";
import { AccountCreationStep } from "./account-creation";
import { Footer } from "../ui/footer";
import { AnimatePresence, motion } from "framer-motion";
import type { UserRole } from "@/types";
import { UserAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export function OnboardingPage() {
    //  const ONBOARDING_STEPS = ["WELCOME", 'ROLE-SELECT', 'BENEFITS', 'CREATE-ACCOUNT']
    const { session, loading } = UserAuth();

    const [currentStep, setCurrentStep] = useState(0)
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

    // Redirect authenticated users to their dashboard or role selection
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-rose-600" size={48} />
            </div>
        );
    }

    if (session) {
        const role = session.user.user_metadata.role as UserRole | undefined;
        if (role) {
            return <Navigate to={role === "HOST" ? "/host/dashboard" : "/vendor/dashboard"} replace />;
        }
        return <Navigate to="/select-role" replace />;
    }

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 3))
    }

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role)
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Animated Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[100px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10 min-h-screen flex flex-col">
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {currentStep == 0 && (
                            <motion.div key="step-0" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <WelcomeStep onNext={handleNext}></WelcomeStep>
                            </motion.div>
                        )}
                        {currentStep == 1 && (
                            <motion.div key="step-1" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <RoleSelectionStep selectedRole={selectedRole} onRoleSelect={handleRoleSelect} onNext={handleNext}></RoleSelectionStep>
                            </motion.div>
                        )}
                        {currentStep == 2 && (
                            <motion.div key="step-2" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <BenefitsStep selectedRole={selectedRole} onNext={handleNext}></BenefitsStep>
                            </motion.div>
                        )}
                        {currentStep == 3 && (
                            <motion.div key="step-3" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                                <AccountCreationStep selectedRole={selectedRole} onNext={handleNext}></AccountCreationStep>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <Footer />
            </div>
        </div>
    )
}