import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/SignInForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign In - Prospect",
  description: "Sign in to your Prospect account",
};

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
