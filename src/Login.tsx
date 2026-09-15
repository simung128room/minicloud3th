import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-card text-white p-4">
      <div className="p-8 bg-card border border-border border-2 w-full max-w-sm brut-card rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <button onClick={() => navigate('/')} className="w-full bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl font-bold text-white transition-all shadow-lg">Back to Home</button>
      </div>
    </div>
  );
}
