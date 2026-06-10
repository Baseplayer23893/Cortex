import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg">
      <Loader2 className="size-8 text-primary animate-spin" />
    </div>
  );
}
