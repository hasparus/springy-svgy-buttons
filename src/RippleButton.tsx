import React from 'react';
import { animated, Spring } from 'react-spring';
import styled from 'styled-components';

import Button, { COLORS } from './Button';
import { Vector2 } from './common_types';
import { makeSvgPointPosition } from './utils';

const StyledRippleButton = styled(Button)`
  &:hover {
    background: ${COLORS.lightBlue};
  }

  & > svg {
    circle {
      fill: rgba(255, 255, 255, 0.4);
    }
  }
`;

type RippleProps = {
  handleRest: () => void;
} & Vector2<number | string>;
const Ripple = ({ x, y, handleRest }: RippleProps) => (
  <Spring
    config={{ tension: 180, friction: 60 }}
    from={{ radius: '0%', opacity: 1 }}
    to={{ radius: '130%', opacity: 0 }}
    onRest={handleRest}
    native={true}
  >
    {({ radius, opacity }) => (
      <animated.circle cx={x} cy={y} r={radius} style={{ opacity }} />
    )}
  </Spring>
);

export type RippleButtonProps = {};
export type RippleButtonState = {
  ripples: Array<Vector2<number | string> & { key: any }>;
};
export default class RippleButton extends React.Component<
  RippleButtonProps,
  RippleButtonState
> {
  public state: RippleButtonState = {
    ripples: [],
  };

  private rippleKey = 1;
  private svgElement: SVGSVGElement | null = null;
  private buttonElement: HTMLButtonElement | null = null;

  public render() {
    const { children } = this.props;
    const { ripples } = this.state;
    return (
      <StyledRippleButton
        onClick={this._handleClick}
        innerRef={this.buttonRef}
      >
        {children}
        <svg
          ref={element => {
            this.svgElement = element;
          }}
        >
          {ripples.map(ripple => (
            <Ripple
              {...ripple}
              key={ripple.key}
              handleRest={this._destroyHead}
            />
          ))}
        </svg>
      </StyledRippleButton>
    );
  }

  private _handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const { svgElement } = this;
    let x: number | string = event.clientX;
    let y: number | string = event.clientY;
    if (x === 0 && y === 0) {
      x = '50%';
      y = '50%';
    } else {
      ({ x, y } = makeSvgPointPosition(
        svgElement as SVGSVGElement,
        event.clientX,
        event.clientY
      ));
    }
    this.setState(({ ripples }) => ({
      // tslint:disable-next-line:no-increment-decrement
      ripples: [...ripples, { x, y, key: this.rippleKey++ }],
    }));
  };

  private _destroyHead = () => {
    this.setState(({ ripples: [_, ...ripples] }) => ({ ripples }));
  };

  private buttonRef = (el: HTMLButtonElement | null) => {
    this.buttonElement = el;
  };
}
