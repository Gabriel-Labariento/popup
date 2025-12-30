import React, {ReactNode} from "react";
import { UserAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

type PrivateRouteProps = {
    children: React.ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const {session} = UserAuth();

    return <>{session ? <>{children}</> : <Navigate to="/"/> }</>
}

export default PrivateRoute