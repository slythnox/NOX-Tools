import React from 'react';
import './JapaneseMatrix.css';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';

export const JapaneseMatrix: React.FC = () => {
  const spans = Array.from({ length: 150 }).map((_, i) => {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    return <span key={i}>{char}</span>;
  });

  return (
    <div className="jp-matrix-wrapper">
      <div className="jp-matrix">
        {spans}
      </div>
    </div>
  );
}

export default JapaneseMatrix;
