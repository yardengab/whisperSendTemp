import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Link } from "preact-router";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // שליטה על פתיחה/סגירת התפריט הצדדי
  const [isLargeScreen, setIsLargeScreen] = useState(false); // שליטה לפי גודל המסך

  // בדיקה אם המסך מספיק גדול כדי להציג את ה-Header המקורי
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // 1024px זה נקודת השבירה ל-lg ב-Tailwind
    };

    handleResize(); // הפעלה ראשונית
    window.addEventListener("resize", handleResize); // הוספת מאזין לאירוע שינוי גודל חלון

    return () => {
      window.removeEventListener("resize", handleResize); // ניקוי המאזין
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // הופך את מצב התפריט
  };

  return (
    <>
      {/* Header למסכים גדולים */}
      {isLargeScreen ? (
        <div className="bg-gray-800 dark:bg-gray-900 text-white p-4">
          <nav className="container mx-auto flex justify-between">
            <Link href="/" className="text-2xl font-bold">WhisperSend</Link>
            <div className="flex items-center space-x-4">
              <Link href="/" className="hover:underline text-slate-300 cursor-pointer">Home</Link>
              <Link href="/encrypt" className="hover:underline text-slate-300 cursor-pointer">Encrypt</Link>
              <Link href="/decrypt" className="hover:underline text-slate-300 cursor-pointer">Decrypt</Link>
              <Link href="/shareSecurely" className="hover:underline text-slate-300 cursor-pointer">Chat</Link>
            </div>
          </nav>
        </div>
      ) : (
        // Header למסכים קטנים עם כפתור התפריט הצדדי
        <div className="bg-gray-800 dark:bg-gray-900 text-white p-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">WhisperSend</Link>
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      )}

      {/* תפריט צדדי (Drawer) שייפתח מצד ימין במסכים קטנים */}
      <div
        className={`fixed top-0 right-0 h-full bg-gray-800 dark:bg-gray-900 text-white w-64 p-6 transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 1000 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Menu</h2>
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col space-y-4">
          <Link href="/" className="hover:underline text-slate-300 cursor-pointer">
            Home
          </Link>
          <Link href="/encrypt" className="hover:underline text-slate-300 cursor-pointer">
            Encrypt
          </Link>
          <Link href="/decrypt" className="hover:underline text-slate-300 cursor-pointer">
            Decrypt
          </Link>
          <Link href="/shareSecurely" className="hover:underline text-slate-300 cursor-pointer">
            Chat
          </Link>
        </nav>
      </div>

      {/* שכבה חצי שקופה על המסך כשנפתח התפריט הצדדי */}
      {isMenuOpen && (
        <div
          onClick={toggleMenu}
          className="fixed inset-0 bg-black bg-opacity-50"
          style={{ zIndex: 999 }}
        />
      )}
    </>
  );
}
