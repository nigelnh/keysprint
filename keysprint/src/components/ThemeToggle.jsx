import styled from '@emotion/styled';

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px;
  border: 2px solid currentColor;
  background: transparent;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <ToggleButton onClick={onToggle}>
      {isDark ? '☀️' : '🌙'}
    </ToggleButton>
  );
} 