type MatrixTileProps = {
  color: string;
};

export const MatrixTile = ({ color }: MatrixTileProps) => (
  <svg
    viewBox='0 0 100 100'
    fill='none'
    preserveAspectRatio='xMidYMid meet'>
    <path
      fill={color}
      fillRule='evenodd'
      d='M0 0h100v100H0zM50 50m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0'
    />
  </svg>
);
