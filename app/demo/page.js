import DemoShell from "../../components/demo-shell";
import { activeTenant } from "../../config/tenants";

export default function DemoHome() {
  return <DemoShell tenant={activeTenant} />;
}
