import { useState } from "react";
import { WelcomeStep } from "./welcome-step";
import { RoleSelectionStep } from "./role-selection-step";
import type { UserRole } from "@/App";
import { BenefitsStep } from "./benefits-page";
import { AccountCreationStep } from "./account-creation";

export function OnboardingPage() {
    //  const ONBOARDING_STEPS = ["WELCOME", 'ROLE-SELECT', 'BENEFITS', 'CREATE-ACCOUNT']

    const [currentStep, setCurrentStep] = useState(0)
    const [selectedRole, setSelectedRole] = useState<UserRole>(null)

    const handleNext = () => {
        setCurrentStep((prev) => Math.min(prev + 1, 3))
    }

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role)
    }

    return (
        <div className="min-h-screen bg-background">
            {currentStep == 0 && <WelcomeStep onNext={handleNext}></WelcomeStep>}
            {currentStep == 1 && <RoleSelectionStep selectedRole={selectedRole} onRoleSelect={handleRoleSelect} onNext={handleNext}></RoleSelectionStep>}
            {currentStep == 2 && <BenefitsStep selectedRole={selectedRole} onNext={handleNext}></BenefitsStep>}
            {currentStep == 3 && <AccountCreationStep selectedRole={selectedRole} onNext={handleNext}></AccountCreationStep>}
        </div>
    )
}