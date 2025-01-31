import styled from '@emotion/styled';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  padding: 2rem;
  border: 4px solid #4ade80;
  box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
  text-align: center;
  image-rendering: pixelated;
  animation: modalPop 0.3s ease-out;

  @keyframes modalPop {
    0% { transform: scale(0); }
    80% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

const WpmDisplay = styled.div`
  font-size: 2.5rem;
  color: #4ade80;
  margin: 1rem 0;
  text-shadow: 4px 4px 0 rgba(0, 0, 0, 0.2);
`;

const PixelButton = styled.button`
  background: #2a2a2a;
  border: 4px solid #4ade80;
  padding: 0.8rem 1.5rem;
  color: #4ade80;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 rgba(74, 222, 128, 0.3);
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: none;
  }
`;

export default function CompletionModal({ wpm, onClose }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>Test Complete!</h2>
        <WpmDisplay>{wpm} WPM</WpmDisplay>
        <PixelButton onClick={onClose}>Try Again</PixelButton>
      </ModalContent>
    </ModalOverlay>
  );
} 