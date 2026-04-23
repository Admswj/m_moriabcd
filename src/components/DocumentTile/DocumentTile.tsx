import { useDocumentTilePlacement } from '../../hooks';
import { planePx, type PlaneCoordinates } from '../Plane';
import type { Document } from './Document';
import './DocumentTile.css';

export const LABEL_PLANE_SIZE = 96;
/** Plane units; scales with `planePx` like label text. */
export const LABEL_UNDERLINE_THICKNESS_PLANE = 6;

export type DocumentTileProps = {
  centerPlacement: PlaneCoordinates;
  width: number;
  document: Document;
  /** Opacity of the cover image only; label stays fully opaque. */
  coverOpacity?: number;
  /** When true, name label stays visible without hover (e.g. dimmed trail). */
  labelPinned?: boolean;
  /** Underline on the name label (e.g. dimmed trail entries that can rewind). */
  labelUnderlined?: boolean;
  /** No pointer / “clickable” look (e.g. current drill head); does not remove onClick unless you omit it. */
  interactionInert?: boolean;
  onClick?: () => void;
};

export const DocumentTile = ({
  centerPlacement,
  width,
  document,
  coverOpacity = 1,
  labelPinned = false,
  labelUnderlined = false,
  interactionInert = false,
  onClick,
}: DocumentTileProps) => {
  const placementStyle = useDocumentTilePlacement({ centerPlacement, width: width });

  return (
    <div
      className={[
        'document-tile-root',
        onClick && !interactionInert ? 'document-tile-clickable' : '',
        interactionInert ? 'document-tile-root--interaction-inert' : '',
        labelPinned ? 'document-tile-root--label-pinned' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      style={placementStyle}>
      <div className='document-tile-media' style={{ opacity: coverOpacity }}>
        <img src={document.coverSrc} decoding='async' alt={document.name}/>
      </div>
      {document.name && (
        <div
          className='document-tile-label'
          style={{
            fontSize: planePx(LABEL_PLANE_SIZE),
            marginTop: planePx(Math.round(LABEL_PLANE_SIZE / 1.2)),
            marginRight: planePx(Math.round(LABEL_PLANE_SIZE / 3)),
            ...(labelUnderlined && {
              textDecorationLine: 'underline',
              textDecorationColor: 'currentColor',
              textDecorationThickness: planePx(LABEL_UNDERLINE_THICKNESS_PLANE),
              textUnderlineOffset: planePx(Math.round(LABEL_PLANE_SIZE / 10)),
            }),
          }}>
          {document.name}
        </div>
      )}
    </div>
  );
};
