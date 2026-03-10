interface AvatarProps {
  id: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function CitizenAvatar({ id, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  // Simple cartoon avatar using SVG
  const avatarColors = [
    { skin: '#FFD6A5', hair: '#4A4A4A' },
    { skin: '#D4A574', hair: '#8B4513' },
    { skin: '#FFE4C4', hair: '#2C1810' },
    { skin: '#C68642', hair: '#1C1C1C' },
    { skin: '#8D5524', hair: '#000000' },
    { skin: '#FFE0BD', hair: '#654321' },
    { skin: '#FFDAB9', hair: '#3D2817' },
    { skin: '#E0AC69', hair: '#5C4033' },
    { skin: '#C19A6B', hair: '#2F1F14' },
    { skin: '#FFE4B5', hair: '#8B7355' },
    { skin: '#DEB887', hair: '#4B3621' },
    { skin: '#F5DEB3', hair: '#6F4E37' },
  ];

  const colors = avatarColors[(id - 1) % avatarColors.length];

  return (
    <svg
      className={sizeClasses[size]}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" fill="#E8F5E9" />
      
      {/* Face */}
      <circle cx="50" cy="45" r="28" fill={colors.skin} />
      
      {/* Hair */}
      <path
        d="M 30 35 Q 30 20, 50 20 Q 70 20, 70 35 L 70 40 Q 70 30, 50 30 Q 30 30, 30 40 Z"
        fill={colors.hair}
      />
      
      {/* Eyes */}
      <circle cx="42" cy="42" r="3" fill="#2C3E50" />
      <circle cx="58" cy="42" r="3" fill="#2C3E50" />
      
      {/* Smile */}
      <path
        d="M 38 52 Q 50 58, 62 52"
        stroke="#E67E22"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Body/Shirt */}
      <path
        d="M 28 70 L 28 85 Q 28 95, 38 95 L 62 95 Q 72 95, 72 85 L 72 70 Q 68 75, 50 75 Q 32 75, 28 70 Z"
        fill="#2196F3"
      />
      
      {/* Neck */}
      <rect x="45" y="68" width="10" height="8" fill={colors.skin} />
    </svg>
  );
}
