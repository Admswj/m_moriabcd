import type { Document } from './data/Document';
import { isCollection, isSingleDocument } from './data/Document';

const cache = new Map<string, ArrayBuffer>();
const inflight = new Map<string, Promise<ArrayBuffer>>();

const isPdfUrl = (src: string) => src.toLowerCase().endsWith('.pdf');

export function collectPdfSrcsFromDocuments(docs: ReadonlyArray<Document>): string[] {
  const out: string[] = [];
  const walk = (d: Document) => {
    if (isCollection(d)) {
      d.children.forEach(walk);
    } else if (isSingleDocument(d) && isPdfUrl(d.documentSrc)) {
      out.push(d.documentSrc);
    }
  };
  docs.forEach(walk);
  return [...new Set(out)];
}

/** Deduped fetch; resolves from memory once loaded. */
export function getPdfBytes(src: string): Promise<ArrayBuffer> {
  if (!isPdfUrl(src)) {
    return Promise.reject(new Error(`Not a PDF URL: ${src}`));
  }
  const hit = cache.get(src);
  if (hit) return Promise.resolve(hit);
  let p = inflight.get(src);
  if (!p) {
    p = fetch(src)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
        return r.arrayBuffer();
      })
      .then((buf) => {
        cache.set(src, buf);
        inflight.delete(src);
        return buf;
      })
      .catch((e) => {
        inflight.delete(src);
        throw e;
      });
    inflight.set(src, p);
  }
  return p;
}

/** Warm cache (e.g. on app mount) so opens are usually instant. */
export function preloadPdfSrcs(srcs: Iterable<string>): void {
  for (const s of srcs) {
    if (isPdfUrl(s)) void getPdfBytes(s);
  }
}
