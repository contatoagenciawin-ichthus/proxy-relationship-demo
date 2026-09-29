import ConversationalDemo from "../../../components/conversational-demo";
import { getConversationalTenant } from "../../../config/conversational-tenants";

export async function generateMetadata({ params }) {
  const { tenant: slug } = await params;
  const tenant = getConversationalTenant(slug);

  return {
    title: `Proxy Conversational Demo | ${tenant.brand}`,
    description: tenant.description,
  };
}

export default async function ConversationalTenantPage({ params }) {
  const { tenant: slug } = await params;
  return <ConversationalDemo tenant={getConversationalTenant(slug)} />;
}
