import ConversationalDemo from "../../components/conversational-demo";
import { getConversationalTenant } from "../../config/conversational-tenants";

export const metadata = {
  title: "Proxy Conversational Demo | Dra. Amanda Fialho",
  description:
    "Demonstração de atendimento conversacional com IA orientada a acolhimento, contexto e continuidade.",
};

export default function ConversationalDemoPage() {
  return <ConversationalDemo tenant={getConversationalTenant("amanda-fialho")} />;
}
