import { render, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import React from "react";
import { ME_QUERY } from "../../hooks/useMe";
import { BrowserRouter as Router } from "react-router-dom";
import { LoggedInRouter } from "../logged-in-router";

describe("<LoggedInRouter />", () => {
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
            role: "Listener",
          },
        },
      },
    },
  ];

  it("shoule render OK", async () => {
    await waitFor(async () => {
      await render(
        <MockedProvider mocks={mocks}>
          <Router>
            <LoggedInRouter />
          </Router>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
