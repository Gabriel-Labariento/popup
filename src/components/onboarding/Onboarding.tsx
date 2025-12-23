import { useState } from "react";
import { WelcomeStep } from "./welcome-step";
import { RoleSelectionStep } from "./role-selection-step";

export type UserRole = 'host' | 'vendor' | null

export function OnboardingPage() {
    //  const ONBOARDING_STEPS = ["WELCOME", 'ROLE-SELECT', 'BENEFITS', 'CREATE-ACCOUNT', 'CONFIRM']

    const [currentStep, setCurrentStep] = useState(0)
    const [selectedRole, setSelectedRole] = useState<UserRole>(null)

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 4))
    }

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role)
    }

    return (
        <div className="min-h-screen bg-background">
            {currentStep == 0 && <WelcomeStep onNext={handleNext}></WelcomeStep>}
            {currentStep == 1 && <RoleSelectionStep selectedRole={selectedRole} onRoleSelect={handleRoleSelect} onNext={handleNext}></RoleSelectionStep>}
            
        </div>
    )
}