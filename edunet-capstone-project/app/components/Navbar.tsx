import React from 'react';
import { Activity } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 fixed top-0 w-full z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 text-teal-600">
          <Activity className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight">MindSpace AI</span>
        </div>
        <div className="text-sm font-medium text-gray-500">
          Digital Wellness Checkup
        </div>
      </div>
    </nav>
  );
}