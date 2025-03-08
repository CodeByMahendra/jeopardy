"use client"
export default function AuthLayout({ children }) {
    return (
      <main>
        <div className="h-screen flex flex-col items-center justify-center
        bg-gradient-to-br from-blue-300 to-purple-600">
          {children}
        </div>
      </main>
    );
  }
  