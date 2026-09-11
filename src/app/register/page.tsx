import RegisterForm from "@/components/register-form";
import { getDict } from "@/lib/i18n";

export default async function RegisterPage() {
  const t = await getDict();
  return <RegisterForm t={t} />;
}
