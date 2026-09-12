import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-black text-white">
      <h1 className="font-cinzel text-7xl font-extrabold text-brand-accent mb-4">404</h1>
      <h2 className="font-cinzel text-2xl font-bold uppercase mb-3">Page Not Found</h2>
      <p className="text-white/60 text-sm max-w-md mb-8">
        The page you are looking for has been moved or does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-accent text-brand-primary font-bold text-xs uppercase tracking-wider hover:bg-brand-accent-light transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
