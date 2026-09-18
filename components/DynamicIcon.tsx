import { getIcon } from "@/lib/icon-map";
import type { LucideProps } from "lucide-react";

export function DynamicIcon({
  iconName,
  ...props
}: { iconName?: string | null } & LucideProps) {
  // getIcon only ever returns a reference from the fixed, module-level ICONS map in
  // lib/icon-map.ts — it never constructs a new component, so this lookup is safe
  // despite the react-hooks/static-components heuristic below.
  /* eslint-disable react-hooks/static-components */
  const Icon = getIcon(iconName);
  return <Icon {...props} />;
  /* eslint-enable react-hooks/static-components */
}
