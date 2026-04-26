import { Fragment, useCallback, useReducer } from 'react';
import { Footer, Plane, DocumentTile, NovepvntiTile } from './components';
import { createInitialDocumentsState, documentsReducer } from './reducers/documentsReducer';
import { documentTilesProps, matrixTileProps, projectTileProps } from './data';
import './App.css';

export const App = () => {
  const [{ documents, indicesPath }, dispatch] = useReducer(documentsReducer, undefined, createInitialDocumentsState);

  const onCollectionTileClick = useCallback((clickedIndex: number) => {
    dispatch({ type: 'click', clickedIndex });
  }, []);

  return (
    <main>
      <Plane className='app-plane'>
        <NovepvntiTile
          {...matrixTileProps}
          onClick={indicesPath.length === 0 ? () => onCollectionTileClick(0) : undefined}
          opacity={indicesPath.length > 0 ? 0.1 : 1}
        />
        {documentTilesProps.map((props, index) => {
          const dimmed = indicesPath.includes(index);
          const latestDimmed = indicesPath.at(-1);
          const isLatestDimmed = latestDimmed === index;
          const trailRewindable = dimmed && !isLatestDimmed;
          return documents[index] ?
              <Fragment key={`${index}-${documents[index]!.name}`}>
                <DocumentTile
                  {...props}
                  document={documents[index]!}
                  coverOpacity={dimmed ? 0.1 : 1}
                  labelPinned={dimmed || index === 0}
                  labelUnderlined={trailRewindable}
                  interactionInert={isLatestDimmed}
                  onClick={() => onCollectionTileClick(index)}
                />
              </Fragment>
            : undefined;
        })}
        <NovepvntiTile
          {...projectTileProps}
          onClick={() => dispatch({ type: 'reset' })}
        />
      </Plane>
      {/*<Explorer layout='horizontal' documentSrc='' />*/}
      <Footer />
    </main>
  );
};
