import type { HTMLAttributes } from 'react';
import './Plane.css';

export const PLANE_SIZE = 10800 as const;

export type PlaneCoordinates = {
  x: number;
  y: number;
};

type PlaneProps = HTMLAttributes<HTMLDivElement>;

export const Plane = ({ children, className, ...rest }: PlaneProps) => (
  <div
    className={['plane', className].filter(Boolean).join(' ')}
    {...rest}>
    {children}
  </div>
);

export const planeUnit = (value: number): string => `${(value / PLANE_SIZE) * 100}%`;

export const planePx = (n: number): string => `calc(100cqw * ${n} / ${PLANE_SIZE})`;
