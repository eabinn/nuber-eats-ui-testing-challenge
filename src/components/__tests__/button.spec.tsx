import { render } from "@testing-library/react";
import React from "react";
import { isLoggedInVar } from "../../apollo";
import { Button } from "../button";

describe("<Button />", () => {
  const buttonProps = {
    canClick: true,
    loading: true,
    actionText: "actionTextTest",
    className: "classNameTest",
  };

  it("renders OK with props", () => {
    render(<Button {...buttonProps} />);
  });

  it("should have className which passed by props", () => {
    const { container } = render(<Button {...buttonProps} />);
    expect(container.querySelector("button")?.classList.contains(buttonProps.className)).toEqual(true);
  });

  it("should have Loding text when loading prop is true", () => {
    const { getByText } = render(<Button {...buttonProps} />);
    getByText("Loading...");
  });

  it("should have actionText when loading state is false", () => {
    buttonProps.loading = false;
    const { getByText } = render(<Button {...buttonProps} />);
    getByText(buttonProps.actionText);
  });
});
