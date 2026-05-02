import { useCallback, useReducer } from 'react';
import type { CSSProperties } from 'react';
import { Footer, Plane, DocumentTile, NovepvntiTile, Explorer } from './components';
import { PLANE_SIZE } from './components/Plane';
import { createInitialDocumentsState, documentsReducer } from './reducers/documentsReducer';
import {
  documentTilesProps,
  matrixTileProps,
  OGGETTO_NAME,
  PLANE_X_OVERFLOW,
  projectTileProps
} from './data';
import './App.css';
import {useExplorer} from "./hooks";

export const App = () => {
  const [{ documents, indicesPath }, dispatch] = useReducer(documentsReducer, undefined, createInitialDocumentsState);
  const explorer = useExplorer(documents, indicesPath);

  const onCollectionTileClick = useCallback((clickedIndex: number) => {
    dispatch({ type: 'click', clickedIndex });
  }, []);

  const renderDocumentTiles = () =>
      documentTilesProps.map((props, index) => {
        const doc = documents[index];
        if (!doc) return null;

        const inPath = indicesPath.includes(index);
        const latestIndex = indicesPath.at(-1);

        return (
            <DocumentTile
                key={`${index}-${doc.name}`}
                {...props}
                document={doc}
                labelPinned={inPath || index === 0}
                labelClickable={inPath && latestIndex !== index}
                onClick={![0, latestIndex].includes(index) ? () => onCollectionTileClick(index) : undefined}
            />
        );
      });

  const renderFooter = () => explorer.showNav ? (
      <Footer
          mode='navigation'
          pdfPage={explorer.pdfPage}
          pdfPagesNum={explorer.pdfNumPages!}
          onPrevious={explorer.prevPage}
          onNext={explorer.nextPage}
          downloadVisible={explorer.isDownloadable}
      />
  ) : (
      <Footer mode='text' prefixed={indicesPath.some(i => documents[i]?.name === OGGETTO_NAME)} />
  );

  return (
      <main>
        <div className='app-body'>
          <div className='app-plane-hub' style={{ '--plane-hub-overflow-x': PLANE_X_OVERFLOW, '--plane-size': PLANE_SIZE } as CSSProperties}>
            <Plane className='app-plane'>
              <NovepvntiTile
                  {...matrixTileProps}
                  onClick={indicesPath.length === 0 ? () => onCollectionTileClick(0) : undefined}
                  opacity={indicesPath.length > 0 ? 0.1 : matrixTileProps.opacity}
              />
              {renderDocumentTiles()}
              <NovepvntiTile {...projectTileProps} onClick={() => dispatch({ type: 'reset' })} />
            </Plane>
          </div>
          {explorer.activeDoc && (
              <Explorer
                  layout={explorer.activeDoc.layout}
                  documentSrc={explorer.activeDoc.documentSrc}
                  firstPageSrc={explorer.activeDoc.firstPageSrc}
                  bgColor={explorer.activeDoc.bgColor}
                  pdfPage={explorer.pdfPage}
                  onPdfLoaded={explorer.setPdfNumPages}
              />
          )}
        </div>
        {renderFooter()}
      </main>
  );
};
