import DemoShell from "../../../components/demo-shell";
import { getTenant } from "../../../config/tenants";

export default async function TenantDemo({ params }) {
  const { tenant: slug } = await params;
  return <DemoShell tenant={getTenant(slug)} />;
}
