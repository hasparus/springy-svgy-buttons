import React from 'react';
import { Spring } from 'react-spring';
import styled from 'styled-components';

import Button, {
  Colors,
  KeyboardFocusableButtonState,
} from './Button';
import { Vector2 } from './common_types';
import { getCenter, makeSvgPointPosition } from './utils';

let CLIP_PATH_COUNTER = 0;

const immediateFilter = (name: string) =>
  name === 'x' || name === 'y';

const ButtonUnderlay = styled.div`
  position: absolute;
  background: ${Colors.DeepBlue};
  color: ${Colors.Yellow};
  padding: 1rem;
  left: 0;
  top: 0;
  border-radius: inherit;
  clip-path: url(#${({ clipPathId }: { clipPathId: string }) => clipPathId});
`;

export type ButtonWithHoverCircleProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};
export type ButtonWithHoverCircleState = {
  isActive: boolean;
  position: Vector2<number>;
} & KeyboardFocusableButtonState;
export default class ButtonWithHoverCircle extends React.Component<
  ButtonWithHoverCircleProps,
  ButtonWithHoverCircleState
> {
  public state = {
    isActive: false,
    keyboardFocused: false,
    position: { x: -9999, y: -9999 },
  };

  // tslint:disable-next-line:no-increment-decrement
  private clipPathId = 'clip-' + CLIP_PATH_COUNTER++;
  private lastMousePosition = { x: 0, y: 0 };
  private mouseDown = false;
  private svgElement: SVGSVGElement | null = null;
  private buttonElement: HTMLButtonElement | null = null;

  public componentDidMount() {
    window.addEventListener('mousemove', this._handleMouseMove);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this._handleMouseMove);
  }

  public render() {
    const { position, isActive } = this.state;
    const { children } = this.props;

    return (
      <Button onClick={this._handleClick} innerRef={this.buttonRef}>
        {children}
        <svg
          ref={element => {
            this.svgElement = element;
          }}
        >
          <clipPath id={this.clipPathId}>
            <Spring
              config={{ tension: 180, friction: 12 }}
              from={{ radius: isActive ? 15 : 150, x: 0, y: 0 }}
              immediate={isActive ? immediateFilter : false}
              to={{
                radius: isActive ? 150 : 15,
                x: position.x,
                y: position.y,
              }}
            >
              {({ x, y, radius }) => (
                <circle cx={x} cy={y} r={`${radius}px`} />
              )}
            </Spring>
          </clipPath>
        </svg>
        <ButtonUnderlay clipPathId={this.clipPathId}>
          {children}
        </ButtonUnderlay>
      </Button>
    );
  }

  private buttonRef = (el: HTMLButtonElement | null) => {
    this.buttonElement = el;
  };

  private _handleClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    this._moveCircle(event.clientX, event.clientY);
    this.setState(({ isActive }) => ({ isActive: !isActive }));

    if (this.props.onClick) {
      this.props.onClick(event);
    }
  };

  private _handleMouseMove = (event: MouseEvent) => {
    this.lastMousePosition = { x: event.clientX, y: event.clientY };

    if (this.state.isActive) return;
    this._moveCircle(event.clientX, event.clientY);
  };

  private _moveCircle = (x: number, y: number) => {
    const { svgElement } = this;
    if (!svgElement) {
      // tslint:disable-next-line:no-console
      console.warn("Can't find svgElement.");
      return;
    }

    // tslint:disable: no-parameter-reassignment
    if (x === 0 && y === 0) {
      if (this.state.isActive) {
        ({ x, y } = this.lastMousePosition);
      } else {
        ({ x, y } = getCenter(svgElement));
      }
    }
    const position = makeSvgPointPosition(svgElement, x, y);
    this.setState({ position });
    // tslint:enable: no-parameter-reassignment
  };
}
