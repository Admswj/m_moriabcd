import { useRef } from 'react';
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useExplorerPdfFreeze } from '../../hooks';
import type { SingleDocument } from '../DocumentTile';
import './Explorer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const PDF_CANVAS_BG = '#e1e5db';

export type ExplorerProps = Pick<SingleDocument, 'documentSrc' | 'layout'> & {
  pdfPage?: number;
  onPdfLoaded?: (numPages: number) => void;
};

export const Explorer = ({ documentSrc, layout, pdfPage = 1, onPdfLoaded }: ExplorerProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const isLandscape = layout === 'horizontal';

  const { frozenPdf, fitScale } = useExplorerPdfFreeze({
    frameRef,
    documentSrc,
    layout,
    enabled: !isLandscape,
  });

  const explorerVariant = {
    horizontal: 'explorer--landscape',
    square: 'explorer--square',
    vertical: 'explorer--portrait',
  }[layout] || 'explorer--portrait';

  return (
      <div className={`explorer ${explorerVariant}`} role='region' aria-label='Explorer'>
        <div className='explorer-media'>
          <div className='explorer-frame' ref={frameRef}>
            {isLandscape ? (
                <video className='explorer-video' src={documentSrc} controls playsInline />
            ) : (
                <PdfDocument
                    file={documentSrc}
                    className='explorer-pdf-doc'
                    loading={null}
                    onLoadSuccess={(pdf) => onPdfLoaded?.(pdf.numPages)}
                >
                  {frozenPdf && (
                      <div className='explorer-pdf-scale-clip'>
                        <div
                            className='explorer-pdf-scale-inner'
                            style={{
                              width: frozenPdf.pageWidth,
                              transform: `scale(${fitScale})`,
                              transformOrigin: 'bottom right',
                            }}
                        >
                          <Page
                              className='explorer-pdf-page'
                              pageNumber={pdfPage}
                              width={frozenPdf.pageWidth}
                              devicePixelRatio={frozenPdf.devicePixelRatio}
                              canvasBackground={PDF_CANVAS_BG}
                              loading={null}
                          />
                        </div>
                      </div>
                  )}
                </PdfDocument>
            )}
          </div>
        </div>
      </div>
  );
};
