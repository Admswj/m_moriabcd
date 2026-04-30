import type { DocumentTileProps, NovepvntiTileProps } from '../components';
import { planePx, PLANE_SIZE } from '../components/Plane';

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

/** Rightmost tile edge in plane units (covers document row + novepvnti tiles). */
const maxPlaneContentX = Math.max(
  PRIMARY_X + 7 * DISTANCE_X + MAJOR_TILE_EDGE / 2,
  PRIMARY_X + matrixTileProps.size / 2,
  projectTileProps.centerPlacement.x + projectTileProps.size / 2,
);

/**
 * How far past the nominal `PLANE_SIZE` square content extends on +X.
 * Used by `.app-plane-hub` padding so the flex row reserves space without
 * resizing or shifting the plane or tile coordinates.
 */
export const PLANE_HUB_OVERFLOW_X_PLANE_UNITS = Math.max(0, Math.ceil(maxPlaneContentX - PLANE_SIZE));
