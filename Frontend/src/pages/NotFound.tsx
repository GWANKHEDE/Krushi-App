import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-green-300 to-yellow-100 p-6 relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute top-[-100px] left-[-150px] w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-[200px] right-[-100px] w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>

        <div className="relative max-w-lg text-center bg-white bg-opacity-95 rounded-3xl shadow-2xl p-12">
          {/* Cute farming plant icon with gentle bounce */}
          <svg
            className="mx-auto mb-8 h-36 w-36 text-green-700 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Leaf with stem */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M32 58C20 48 8 24 32 8c24 16 12 40 0 50z"
            />
            <line x1="32" y1="8" x2="32" y2="58" strokeWidth="3" />
          </svg>

          <h1 className="text-8xl font-extrabold text-amber-700 mb-4 tracking-wide drop-shadow-md">
            404
          </h1>
          <p className="text-2xl text-green-900 mb-8 font-serif italic leading-relaxed max-w-md mx-auto">
            Oops! Looks like you’ve wandered off the beaten path. But don’t worry — the farm is just a click away!
          </p>

          <a
            href="/"
            className="inline-block px-12 py-4 bg-amber-600 text-white font-bold rounded-full shadow-lg hover:bg-amber-700 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            aria-label="Return to Home"
          >
            Take me back home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
