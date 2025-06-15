// components/home-page-client-wrapper.tsx

'use client'; // Bu dosyanın bir Client Component olduğunu belirtiyoruz

import React, { useState } from 'react';

// children prop'u, içine başka bileşenlerin yerleştirilmesini sağlar
export default function HomePageClientWrapper({ children }: { children: React.ReactNode }) {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <h1 className="text-center text-xl my-4">Client Wrapper Başlığı</h1>
      <div className="text-center mb-4">
        <p>Bu bir Client Component, state tutabilir.</p>
        <button 
          className="bg-blue-500 text-white px-3 py-1 rounded-md mt-2"
          onClick={() => setCounter(counter + 1)}
        >
          Tıkla: {counter}
        </button>
      </div>

      <hr className="my-8" />

      {/* Sunucudan gelen hazır HTML (Server Component) buraya yerleştirilecek */}
      {children} 
    </div>
  );
}