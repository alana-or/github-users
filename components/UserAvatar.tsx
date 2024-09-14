import React from 'react';

interface UserAvatarProps {
  src: string;
  alt: string;
  className?: string;
}

const UserAvatar = ({ src, alt, className = '' }: UserAvatarProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-full ${className}`}
    />
  );
};

export default UserAvatar;
