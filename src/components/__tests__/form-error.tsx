import { render } from "@testing-library/react";
import React from "react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  const formErrorProps = {
    errorMessage: "errorMessageTest",
  };

  it("should render OK with props", () => {
    const { getByText } = render(<FormError {...formErrorProps} />);
    getByText(formErrorProps.errorMessage);
  });
});
