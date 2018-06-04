import React from 'react';
import styled, { css } from 'styled-components';

import stylesReset from './button_styles_reset';

// from styled-components
export type InnerRef =
  | ((instance: any) => void)
  | React.RefObject<HTMLElement | SVGElement | React.Component>;

export const enum COLORS {
  blue = '#2979FF',
  lightBlue = '#3d8aff',
  deepBlue = '#2962FF',
  yellow = '#FFBE0B',
}

export type BaseStyledButtonProps = {
  keyboardFocused: boolean;
  onBlur: React.FocusEventHandler<HTMLButtonElement>;
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
  onMouseUp: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave: React.MouseEventHandler<HTMLButtonElement>;
  innerRef?: InnerRef;
};
const BaseStyledButton = styled.button`
  ${stylesReset} position: relative;
  color: white;
  padding: 1rem;
  border-radius: 3px;
  background: ${COLORS.blue};

  & > svg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  outline: 0;

  ${(props: BaseStyledButtonProps) =>
    props.keyboardFocused
      ? css`
          background: ${COLORS.lightBlue};
        `
      : ''};
`;

export type KeyboardFocusableButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  innerRef?: InnerRef;
};
export type KeyboardFocusableButtonState = {
  keyboardFocused: boolean;
};
export default class KeyboardFocusableButton extends React.Component<
  KeyboardFocusableButtonProps,
  KeyboardFocusableButtonState
> {
  public state = {
    keyboardFocused: false,
  };

  private mouseDown = false;

  public render() {
    const { children, ...rest } = this.props;
    const { keyboardFocused } = this.state;

    return (
      <BaseStyledButton
        {...rest}
        keyboardFocused={keyboardFocused}
        onBlur={this._handleBlur}
        onFocus={this._handleFocus}
        onMouseUp={this._handleMouseUp}
        onMouseDown={this._handleMouseDown}
        onMouseLeave={this._handleMouseUp}
      >
        {children}
      </BaseStyledButton>
    );
  }

  private _handleMouseDown = () => {
    this.mouseDown = true;
  };

  private _handleMouseUp = () => {
    if (this.state.keyboardFocused) {
      this.setState({ keyboardFocused: false });
    }
    this.mouseDown = false;
  };

  private _handleFocus = () => {
    this.setState({ keyboardFocused: !this.mouseDown });
  };

  private _handleBlur = () => {
    this.setState({ keyboardFocused: false });
  };
}
