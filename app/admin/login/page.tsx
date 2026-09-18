import { LoginForm } from "@/app/admin/login/LoginForm";
import { getSiteSettings } from "@/lib/data/settings";

export default async function AdminLoginPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6">
      <div className="w-full max-w-sm rounded-2xl border border-navy-800 bg-navy-900 p-8">
        <h1 className="font-heading text-xl font-semibold text-white">{settings.firmName}</h1>
        <p className="mt-1 text-sm text-navy-300">Sign in to the admin panel</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
