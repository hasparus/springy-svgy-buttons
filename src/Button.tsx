import React from 'react';
import styled, { css } from 'styled-components';

import stylesReset from './button_styles_reset';

// from styled-components
export type InnerRef =
  | ((instance: any) => void)
  | React.RefObject<HTMLElement | SVGElement | React.Component>;

export const enum Colors {
  Blue = '#2979FF',
  LightBlue = '#3d8aff',
  DeepBlue = '#2962FF',
  Yellow = '#FFBE0B',
}

export type BackgroundColors = {
  focused: string;
  normal: string;
};

export type BaseStyledButtonProps = {
  keyboardFocused: boolean;
  onBlur: React.FocusEventHandler<HTMLButtonElement>;
  onFocus: React.FocusEventHandler<HTMLButtonElement>;
  onMouseUp: React.MouseEventHandler<HTMLButtonElement>;
  onMouseDown: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave: React.MouseEventHandler<HTMLButtonElement>;
  innerRef?: InnerRef;
  backgroundColor: BackgroundColors;
};
const BaseStyledButton = styled.button`
  ${stylesReset} position: relative;
  color: white;
  padding: 1rem;
  border-radius: 3px;
  background: ${props => props.backgroundColor.normal};

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
          background: ${props.backgroundColor.focused};
        `
      : ''};
`;

export type DefaultProps = {
  backgroundColor: BackgroundColors;
};
export type KeyboardFocusableButtonProps = {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  innerRef?: InnerRef;
} & Partial<DefaultProps>;
export type KeyboardFocusableButtonState = {
  keyboardFocused: boolean;
};
export default class KeyboardFocusableButton extends React.Component<
  KeyboardFocusableButtonProps,
  KeyboardFocusableButtonState
> {
  public static defaultProps = {
    backgroundColor: {
      focused: Colors.LightBlue,
      normal: Colors.Blue,
    },
  };

  public state = {
    keyboardFocused: false,
  };

  private mouseDown = false;

  public render() {
    const { children, ...rest } = this
      .props as KeyboardFocusableButtonProps & DefaultProps;
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
