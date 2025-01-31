import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

const CatContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 20px auto;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    transition: opacity 0.1s;
  }
`;

export default function BongoCat({ isTyping }) {
  const [frame, setFrame] = useState(1);

  useEffect(() => {
    if (isTyping) {
      setFrame(2);
      const timer = setTimeout(() => setFrame(1), 100);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  return (
    <CatContainer>
      <img
        src="/bongo-cat-1.png"
        alt="Bongo Cat Frame 1"
        style={{ opacity: frame === 1 ? 1 : 0 }}
      />
      <img
        src="/bongo-cat-2.png"
        alt="Bongo Cat Frame 2"
        style={{ opacity: frame === 2 ? 1 : 0 }}
      />
    </CatContainer>
  );
} 