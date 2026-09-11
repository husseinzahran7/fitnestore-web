import { Suspense } from "react";
import LoginForm from "@/components/login-form";
import { getDict } from "@/lib/i18n";

export default async function LoginPage() {
  const t = await getDict();
  return (
    <Suspense>
      <LoginForm t={t} />
    </Suspense>
  );
}
