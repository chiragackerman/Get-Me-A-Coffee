export default function DashboardLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Checking your profile"
      className="flex flex-1 items-center justify-center bg-cream px-4 py-12"
    >
      <p className="text-mocha">Checking your profile...</p>
    </main>
  );
}
