import { memo } from 'react';

const CommitteeCard = ({ name, role, image, isActive = false }) => {
  const nameParts = name.trim().split(/\s+/);
  const firstLine = nameParts.slice(0, -1).join(' ') || name;
  const secondLine = nameParts.slice(-1)[0] || '';

  return (
    <div 
      className={`
        group relative w-full aspect-3/4
        overflow-hidden rounded-xl
        transition-all duration-300 ease-in-out
        ${isActive 
          ? 'scale-105 grayscale-0 opacity-100 z-10' 
          : 'scale-95 grayscale opacity-70'
        }
      `}
    >
      {/* Full Height Image */}
      <img
        src={image}
        alt={name}
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover object-top"
      />

      {/* Dark overlay for non-active cards */}
      <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/20' : 'bg-black/55'}`}></div>
      
      {/* Dark Gradient Overlay at Bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>

      {/* Name and Role at Bottom */}
      <div className="absolute bottom-4 left-4 right-4">
        <h3 
          className={`
            font-bold text-lg uppercase tracking-wide leading-tight
            transition-colors duration-400
            ${isActive ? 'text-white' : 'text-white/60'}
          `}
        >
          {firstLine}
        </h3>
        <h3 
          className={`
            font-bold text-lg uppercase tracking-wide leading-tight
            transition-colors duration-400
            ${isActive ? 'text-white' : 'text-white/60'}
          `}
        >
          {secondLine}
        </h3>
        <p 
          className={`
            text-sm font-medium mt-1 uppercase
            transition-colors duration-400
            ${isActive ? 'text-[#bc0034]' : 'text-[#bc0034]/45'}
          `}
        >
          {role}
        </p>
      </div>
    </div>
  );
};

export default memo(CommitteeCard);