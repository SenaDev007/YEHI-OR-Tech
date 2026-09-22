import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ManagerDashboard from "@/components/manager/ManagerDashboard";
import { managerCookieName, verifyManagerSession } from "@/lib/manager-auth";

export default async function ManagerPage() {
  const session = verifyManagerSession((await cookies()).get(managerCookieName)?.value);
  if (!session) redirect("/manager/login");
  return <ManagerDashboard session={session} />;
}
