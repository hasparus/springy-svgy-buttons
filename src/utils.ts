import { Vector2 } from './common_types';

export function makeSvgPointPosition(
  svgElement: SVGSVGElement,
  x: number,
  y: number
) {
  return Object.assign(svgElement.createSVGPoint(), {
    x,
    y,
  }).matrixTransform(
    (svgElement.getScreenCTM() as SVGMatrix).inverse()
  );
}

export function getCenter(
  htmlElement: HTMLElement | SVGElement
): Vector2 {
  const {
    left: rx,
    top: ry,
    width,
    height,
  } = htmlElement.getBoundingClientRect();
  return {
    x: rx + width / 2,
    y: ry + height / 2,
  };
}
