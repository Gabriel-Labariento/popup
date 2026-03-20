import { Outlet } from "react-router-dom";
import Nav from "./Nav";

export default function Layout() {
    return (
        <div className="app-container">
            <Nav links={[]} />
            <main>
                <Outlet></Outlet>
            </main>
        </div>


    )
}