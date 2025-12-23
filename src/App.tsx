import { useState } from 'react'
import './App.css'
import {OnboardingPage} from './components/onboarding/Onboarding'

export type UserRole = 'host' | 'vendor' | null

function App() {
  return (
    <OnboardingPage></OnboardingPage>
  )
}
export default App
