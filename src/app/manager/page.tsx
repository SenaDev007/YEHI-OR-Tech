import { redirect } from "next/navigation";

/**
 * /manager → /manager/dashboard
 */
export default function ManagerIndexPage() {
  redirect("/manager/dashboard");
}
