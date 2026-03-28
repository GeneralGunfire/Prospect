import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign Up - Prospect",
  description: "Create a new Prospect account",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
}
