import type { DocumentTileProps, NovepvntiTileProps } from '../components';
import { planePx, PLANE_SIZE } from '../components/Plane';

export const DISTANCE_X = 1222;
export const PRIMARY_X = 3311;
export const MAJOR_TILE_EDGE = 727;

export const matrixTileProps: NovepvntiTileProps = {
  color: '#b3baad',
  opacity: 0.66,
  size: 727,
  centerPlacement: {
    x: PRIMARY_X,
    y: 7547,
  },
  filter: `blur(${planePx(17)})`,
};

export const projectTileProps: NovepvntiTileProps = {
  color: '#84887f',
  size: 363,
  centerPlacement: {
    x: 3762,
    y: 7397,
  },
  filter: `blur(${planePx(6)})`,
};

export const documentTilesProps: Array<Pick<DocumentTileProps, 'width' | 'centerPlacement'>> = [...Array(8).keys()].map(
  (a) => ({
    width: MAJOR_TILE_EDGE,
    centerPlacement: {
      x: PRIMARY_X + a * DISTANCE_X,
      y: 7547,
    },
  }),
);

const maxContentX = Math.max(
  PRIMARY_X + 7 * DISTANCE_X + MAJOR_TILE_EDGE / 2,
  PRIMARY_X + matrixTileProps.size / 2,
  projectTileProps.centerPlacement.x + projectTileProps.size / 2,
);

export const PLANE_X_OVERFLOW = Math.max(0, Math.ceil(maxContentX - PLANE_SIZE));
