import { useNovepvntiTilePlacement } from '../../hooks';
import type { PlaneCoordinates } from '../Plane';
import { MatrixTile } from '../../assets';
import './NovepvntiTile.css';

export type NovepvntiTileProps = {
  centerPlacement: PlaneCoordinates;
  color: string;
  size: number;
  opacity?: number;
  onClick?: () => void;
};

export const NovepvntiTile = ({
  centerPlacement,
  color,
  size,
  opacity = 1,
  onClick,
}: NovepvntiTileProps) => {
  const placementStyle = useNovepvntiTilePlacement({ centerPlacement, size });

  return (
    <div
      className={['novepvnti-tile', onClick ? 'novepvnti-tile-clickable' : ''].filter(Boolean).join(' ')}
      onClick={onClick}
      style={{
        ...placementStyle,
        opacity,
      }}>
      <MatrixTile color={color} />
    </div>
  );
};
