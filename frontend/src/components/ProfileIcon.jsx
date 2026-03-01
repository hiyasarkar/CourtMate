import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfileIcon({ name, imageUrl }) {
  const navigate = useNavigate();
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div
      onClick={() => navigate('/profile')}
      className="cursor-pointer transition transform hover:scale-110"
      title="View Profile"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-10 h-10 rounded-full border-2 border-orange-400 object-cover shadow-sm"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
          {initial}
        </div>
      )}
    </div>
  );
}
