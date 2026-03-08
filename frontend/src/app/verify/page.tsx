import { VerifyClient } from "@/app/verify/verify-client";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token ?? null;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6">
      <div className="w-full max-w-xl rounded-xl border border-gray-800 bg-gray-900/80 p-8 text-center space-y-3">
        <h1 className="text-2xl font-semibold">Founder Radar Verification</h1>
        <VerifyClient token={token} />
      </div>
    </main>
  );
}
