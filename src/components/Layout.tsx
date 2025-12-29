import { Outlet, Link } from "react-router-dom";
import Nav from "./Nav";

export default function Layout() {
    return (
        <div className="app-container">
            <Nav></Nav>
            <main>
                <Outlet></Outlet>
            </main>
        </div>


    )
}