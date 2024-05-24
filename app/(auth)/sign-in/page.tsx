import AuthForm from "@/components/auth-form";
import { getLoggedInUser } from "@/lib/actions/user.actions";

export default async function SignIn() {
    const loggedInUser = await getLoggedInUser();

    return (
        <section className="flex-center size-full max-sm:px-6">
            <AuthForm type="sign-in" />
        </section>
    );
}
