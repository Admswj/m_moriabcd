import { useEffect } from 'react';
import './Footer.css';

type FooterProps =
  | {
      mode: 'link';
      prefixed: boolean;
    }
  | {
      mode: 'navigation';
      onPrevious: () => void;
      onDownload: () => void;
      onNext: () => void;
      pdfPage: number;
      pdfNumPages: number;
    };

const selectionTouchesFooterText = (): boolean => {
  const sel = window.getSelection();
  if (!sel?.rangeCount || sel.isCollapsed) return false;
  const inText = (n: Node | null) => {
    const el = n?.nodeType === Node.TEXT_NODE ? (n as Text).parentElement : (n as Element | null);
    return Boolean(el?.closest('.app-footer-text'));
  };
  return inText(sel.anchorNode) || inText(sel.focusNode);
};

export const Footer = (props: FooterProps = { mode: 'link', prefixed: false }) => {
  useEffect(() => {
    if (props.mode === 'navigation') return;

    const onMouseDown = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (t.closest('.app-footer-text')) return;
      if (selectionTouchesFooterText()) {
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [props.mode]);

  if (props.mode === 'navigation') {
    const atFirst = props.pdfPage <= 1;
    const atLast = props.pdfPage >= props.pdfNumPages;
    return (
      <footer className='app-footer app-footer--navigation'>
        <div className='app-footer-nav'>
          <button
            type='button'
            className='app-footer-nav__btn'
            aria-label='Previous page'
            disabled={atFirst}
            onClick={props.onPrevious}>
            ←
          </button>
          <button
            type='button'
            className='app-footer-nav__btn'
            aria-label='Next page'
            disabled={atLast}
            onClick={props.onNext}>
            →
          </button>
        </div>
      </footer>
    );
  }

  return (
    <footer className='app-footer'>
      <span className='app-footer-text'>
        {props.mode === 'link' && props.prefixed ? 'For object inquiry please contact: ' : null}
        info@mmoriabcd.com
      </span>
    </footer>
  );
};
