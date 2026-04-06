interface HeartIconProps {
  filled?: boolean;
}

const HeartIcon = ({ filled = false }: HeartIconProps) => (
  <svg viewBox="0 0 24 24" className={filled ? 'heart-svg filled' : 'heart-svg outline'} aria-hidden="true">
    <path
      d="M12 21.35c-.49-.4-4.92-4.03-7.46-6.26C2.45 12.66 2 10.8 2 9.09 2 6.59 4.14 4.5 6.67 4.5c1.42 0 2.78.72 3.61 1.85.84-1.13 2.19-1.85 3.61-1.85 2.53 0 4.67 2.09 4.67 4.59 0 1.71-.45 3.57-2.08 5.99-2.55 2.24-6.97 5.86-7.45 6.26z"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.8}
    />
  </svg>
);

export default HeartIcon;
