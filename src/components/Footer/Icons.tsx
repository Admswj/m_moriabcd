const svgCommon = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  className: 'app-footer-nav__icon',
};

export const FooterNavIconPrevious = () => (
  <svg {...svgCommon}>
    <path d='m15 18-6-6 6-6' />
  </svg>
);

export const FooterNavIconDownload = () => (
  <svg {...svgCommon}>
    <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
    <polyline points='7 10 12 15 17 10' />
    <line
      x1='12'
      y1='15'
      x2='12'
      y2='3'
    />
  </svg>
);

export const FooterNavIconNext = () => (
  <svg {...svgCommon}>
    <path d='m9 18 6-6-6-6' />
  </svg>
);
