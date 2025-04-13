

import ResetPasswordForm from "@/components/ResetPasswordForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
<ResetPasswordForm/>
    </Suspense>
  );
}
