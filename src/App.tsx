import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { SignUpForm } from "./components/sign-up-form"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUpForm/>} />
    </Routes>
  )
}
