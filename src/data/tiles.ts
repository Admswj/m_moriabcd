import type { DocumentTileProps, NovepvntiTileProps } from '../components';
import { planePx } from '../components/Plane';

export const DISTANCE_X = 1222;
export const PRIMARY_X = 3311;
export const MAJOR_TILE_EDGE = 727;

export const matrixTileProps: NovepvntiTileProps = {
  color: '#9da696',
  opacity: 0.88,
  size: 727,
  centerPlacement: {
    x: PRIMARY_X,
    y: 7547,
  },
  filter: `blur(${planePx(17)})`,
};

export const projectTileProps: NovepvntiTileProps = {
  color: '#ededed',
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
