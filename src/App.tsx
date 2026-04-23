import { Fragment, useCallback, useReducer } from 'react';
import { Footer, Plane, DocumentTile, NovepvntiTile } from './components';
import { createInitialDocumentsState, documentsReducer } from './reducers/documentsReducer';
import { documentTilesProps, matrixTileProps, projectTileProps } from './data';
import './App.css';

export const App = () => {
  const [{ documents, dimmedTileIndices }, dispatch] = useReducer(
    documentsReducer,
    undefined,
    createInitialDocumentsState,
  );

  const onCollectionTileClick = useCallback((clickedIndex: number) => {
    dispatch({ type: 'openCollection', clickedIndex });
  }, []);

  return (
    <main>
      <Plane className='app-plane'>
        <NovepvntiTile {...matrixTileProps} />
        {documentTilesProps.map((props, index) => {
          const dimmed = dimmedTileIndices.includes(index);
          const latestDimmed = dimmedTileIndices.at(-1);
          const isLatestDimmed = latestDimmed === index;
          const trailRewindable = dimmed && !isLatestDimmed;
          return documents[index] ? (
            <Fragment key={`${index}-${documents[index]!.name}`}>
              <DocumentTile
                {...props}
                document={documents[index]!}
                coverOpacity={dimmed ? 0.1 : 1}
                labelPinned={dimmed}
                labelUnderlined={trailRewindable}
                interactionInert={isLatestDimmed}
                onClick={() => onCollectionTileClick(index)}
              />
            </Fragment>
          ) : undefined;
        })}
        <NovepvntiTile {...projectTileProps} onClick={() => dispatch({ type: 'reset' })} />
      </Plane>
      <Footer />
    </main>
  );
};
