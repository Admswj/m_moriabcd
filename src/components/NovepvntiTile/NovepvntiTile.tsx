import { useNovepvntiTilePlacement } from '../../hooks';
import type { PlaneCoordinates } from '../Plane';
import { MatrixTile } from '../../assets';
import './NovepvntiTile.css';
import type { CSSProperties } from 'react';

export type NovepvntiTileProps = {
  centerPlacement: PlaneCoordinates;
  color: string;
  size: number;
  filter?: CSSProperties['filter'];
  opacity?: CSSProperties['opacity'];
  onClick?: () => void;
};

export const NovepvntiTile = ({ centerPlacement, color, size, filter, opacity = 1, onClick }: NovepvntiTileProps) => {
  const placementStyle = useNovepvntiTilePlacement({ centerPlacement, size });

  return (
    <div
      className={'novepvnti-tile'}
      onClick={onClick}
      style={{
        ...placementStyle,
          ...(onClick && { cursor: 'pointer' }),
        opacity,
        filter,
      }}>
      <MatrixTile color={color} />
    </div>
  );
};
