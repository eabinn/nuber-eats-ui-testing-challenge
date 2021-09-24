import { render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import React from "react";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Header />", () => {
  it("renders OK", async () => {
    const mocks = [
      {
        request: {
          query: ME_QUERY,
        },
        result: {
          data: {
            me: {
              id: 1,
              email: "emailTest",
              role: "roleTest",
            },
          },
        },
      },
    ];
    await waitFor(async () => {
      const { getByText, debug } = render(
        <MockedProvider mocks={mocks}>
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText(mocks[0].result.data.me.email);
    });
  });
});
