"use client";

import styled from "styled-components";
import { color, space, layout, compose, variant } from "styled-system";

// Define Button Props
interface ButtonProps {
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "danger";
  children?: React.ReactNode;
  style?: React.CSSProperties; 
  width?: string; 
  height?: string; 
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

// Styled Button using styled-system and styled-components
const StyledButton = styled("button")<ButtonProps>(
  {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "background-color 0.3s ease",
    fontWeight: 600,
    borderRadius: "4px",
    padding: "12px 24px", 
    textAlign: "center",
    height: "50px", 
    width: "200px",
  },
  variant({
    prop: "variant",
    variants: {
      text: {
        background: "transparent",
        border: "none",
        color: "primary",
      },
      outlined: {
        background: "transparent",
        border: "2px solid",
        borderColor: "primary",
        color: "primary",
      },
      contained: {
        color: "white",
        "&:hover": {
          backgroundColor: "darkblue",
        },
      },
    },
  }),
  variant({
    prop: "size",
    variants: {
      small: {
        padding: "8px 16px",
        fontSize: "12px",
      },
      medium: {
        padding: "12px 24px",
        fontSize: "16px",
      },
      large: {
        padding: "16px 32px",
        fontSize: "20px",
      },
    },
  }),
  compose(color, space, layout)
);

// Main Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  variant = "contained",
  size = "medium",
  style,
  width,
  height,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      style={{ width: width || "200px", height: height || "50px", ...style }}
      onClick={props.onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
