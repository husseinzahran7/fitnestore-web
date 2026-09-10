import SubsAdminClient from "@/components/subs-admin";
import { listAllAppSubs, listAllLinks } from "@/lib/subscriptions";
import { getDict } from "@/lib/i18n";

export const metadata = { title: "Subscriptions" };

export default async function AdminSubsPage() {
  const [links, subs, t] = await Promise.all([listAllLinks(), listAllAppSubs(), getDict()]);
  return <SubsAdminClient links={links} subs={subs} t={t} />;
}
