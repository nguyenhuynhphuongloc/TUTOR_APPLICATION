export default function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E72929]"></div>
      <span className="ml-3 text-lg font-medium">Loading...</span>
    </div>
  );
}
