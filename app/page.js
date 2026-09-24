import DemoShell from "../components/demo-shell";
import { activeTenant } from "../config/tenants";

export default function Home() {
  return <DemoShell tenant={activeTenant} />;
}
