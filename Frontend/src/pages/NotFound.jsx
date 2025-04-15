import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-extrabold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
        <p className="text-gray-500 mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <Button onClick={() => navigate("/")}   className="bg-[#001f3f] text-white hover:bg-[#336699] px-8 py-6 text-xl rounded-xl shadow-md hover:shadow-lg active:shadow-none transition-shadow"

        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
