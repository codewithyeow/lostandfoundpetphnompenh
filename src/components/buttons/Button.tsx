"use client";

import styled from "styled-components";
import { color, space, layout, compose, variant } from "styled-system";

// Define Button Props
interface ButtonProps {
  variant?: "text" | "outlined" | "contained";
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "danger";
  children?: React.ReactNode;
  style?: React.CSSProperties; // Allow inline styles via style prop
  width?: string; // Allow setting width explicitly via props
  height?: string; // Allow setting height explicitly via props
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
    borderRadius: "4px", // Add border-radius to give it rounded corners
    padding: "12px 24px", // Default padding for the button
    textAlign: "center",
    height: "50px", // Default height for the button
    width: "200px", // Default width for the button
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
        background: ({ backgroundColor }: { backgroundColor?: string }) =>
          backgroundColor || "primary", // Use prop for background color
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
  color = "primary",
  style,
  width,
  height,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      color={color}
      style={{ width: width || "200px", height: height || "50px", ...style }}
      onClick = {props.onClick}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
