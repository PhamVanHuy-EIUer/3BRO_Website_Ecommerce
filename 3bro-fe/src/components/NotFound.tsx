import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-gray-600">Not Found</p>
      <Link
        href="/"
        className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
      >
        Back to Home Page
      </Link>
    </div>
  );
}
