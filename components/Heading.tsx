import React from 'react';

interface HeadingProps {
  text: string;
}

const Heading = ({ text }: HeadingProps) => {
  return (
    <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center w-full">
      {text}
    </h1>
  );
};

export default Heading;