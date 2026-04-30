import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import type { SingleDocument } from '../DocumentTile';
import './Explorer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

/** Max effective DPR for pdf.js canvas (memory vs sharpness). */
const PDF_RENDER_DPR_CAP = 14;
/**
 * Extra factor on top of screen DPR so full-page browser zoom still has enough
 * raster resolution; react-pdf passes this into pdf.js viewport scale.
 */
const PDF_RENDER_OVERSAMPLE = 2;

/** Match `:root --color-bg` so pdf.js clears (`alpha: false`) do not flash white. */
const PDF_CANVAS_BG = '#e1e5db';

export type ExplorerProps = Pick<SingleDocument, 'documentSrc' | 'layout'> & {
  /** 1-based page; when omitted, defaults to 1. */
  pdfPage?: number;
  /** Called when the PDF reports how many pages it has (not called for video). */
  onPdfLoaded?: (numPages: number) => void;
};

type PdfLayout = { pageWidth: number; devicePixelRatio: number };

const quantizeDpr = (raw: number) => Math.min(PDF_RENDER_DPR_CAP, Math.round(raw * 100) / 100);

export const Explorer = ({ documentSrc, layout, pdfPage = 1, onPdfLoaded }: ExplorerProps) => {
  const frameRef = useRef<HTMLDivElement>(null);
  /** After first successful measure, `width` / `devicePixelRatio` stay fixed (no pdf.js redraw on resize/zoom). */
  const [frozenPdf, setFrozenPdf] = useState<PdfLayout | null>(null);
  /** Visual scale only (does not change `<Page />` props — same frozen pdf.js resolution). */
  const [fitScale, setFitScale] = useState(1);
  /** Bytes from shared preload cache (or fetch); avoids duplicate network + default loading copy when warm. */
  const [pdfFile, setPdfFile] = useState<ArrayBuffer | string | null>(null);
  const landscape = layout === 'horizontal';
  const explorerVariant =
    layout === 'horizontal' ? 'explorer--landscape' : layout === 'square' ? 'explorer--square' : 'explorer--portrait';

  useLayoutEffect(() => {
    setFrozenPdf(null);
    setFitScale(1);
    setPdfFile(null);
  }, [documentSrc, layout]);

  useEffect(() => {
    if (landscape) {
      setPdfFile(null);
      return;
    }
    setPdfFile(documentSrc);
  }, [documentSrc, landscape]);

  useEffect(() => {
    if (landscape || !frozenPdf) return;
    const el = frameRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      if (w <= 0 || frozenPdf.pageWidth <= 0) return;
      setFitScale(w / frozenPdf.pageWidth);
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [landscape, frozenPdf]);

  useEffect(() => {
    if (landscape) return;

    const el = frameRef.current;
    if (!el) return;

    let raf = 0;
    let didLock = false;

    const stop = (ro: ResizeObserver, onWin: () => void) => {
      ro.disconnect();
      window.removeEventListener('resize', onWin);
      window.visualViewport?.removeEventListener('resize', onWin);
    };

    const tryLock = () => {
      if (didLock) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (didLock) return;
        const w = el.clientWidth;
        if (w <= 0) return;
        const base = window.devicePixelRatio || 1;
        const pinch = window.visualViewport?.scale ?? 1;
        const dpr = quantizeDpr(base * pinch * PDF_RENDER_OVERSAMPLE);
        didLock = true;
        setFrozenPdf({ pageWidth: w, devicePixelRatio: dpr });
        stop(ro, onWin);
      });
    };

    const ro = new ResizeObserver(tryLock);
    const onWin = () => tryLock();
    ro.observe(el);
    window.addEventListener('resize', onWin);
    window.visualViewport?.addEventListener('resize', onWin);
    tryLock();

    return () => {
      cancelAnimationFrame(raf);
      didLock = true;
      stop(ro, onWin);
    };
  }, [landscape, documentSrc, layout]);

  return (
    <div
      className={['explorer', explorerVariant].join(' ')}
      role='region'
      aria-label='Explorer'>
      <div className='explorer-media'>
        <div
          className='explorer-frame'
          ref={frameRef}>
          {landscape ?
            <video
              className='explorer-video'
              src={documentSrc}
              controls
              playsInline
            />
          : pdfFile ?
            <PdfDocument
              file={typeof pdfFile === 'string' ? pdfFile : pdfFile.slice(0)}
              className='explorer-pdf-doc'
              loading={null}
              onLoadSuccess={(pdf) => {
                onPdfLoaded?.(pdf.numPages);
              }}>
              {frozenPdf ?
                <div className='explorer-pdf-scale-clip'>
                  <div
                    className='explorer-pdf-scale-inner'
                    style={{
                      width: frozenPdf.pageWidth,
                      transform: `scale(${fitScale})`,
                      transformOrigin: 'bottom right',
                    }}>
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
              : null}
            </PdfDocument>
          : null}
        </div>
      </div>
    </div>
  );
};
