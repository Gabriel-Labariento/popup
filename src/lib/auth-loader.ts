import { redirect } from "react-router";
import { createClient } from "@/lib/supabase/client";

export async function requireAuth() {
    const supabase = createClient();
    const {
        data: {session}
    } = await supabase.auth.getSession();
    if (!session) {
        return redirect("/login");
    }
    return {user: session.user};
}

export async function requireGuest() {
    const supabase = createClient();
    const {
        data: {session}
    } = await supabase.auth.getSession();
    if (session) {
        throw redirect("/protected");
    }
    return null;
}