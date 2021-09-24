import { render, waitFor } from "../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { Login, LOGIN_MUTATION } from "../login";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      );
    });
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Log In | Nuber-podcasts");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    await waitFor(() => {
      userEvent.type(email, "asdf");
      userEvent.clear(email);
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email is required!/i);
  });

  it("displays password required errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    const submitBtn = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "abc@naver.com");
      userEvent.click(submitBtn);
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required!/i);
  });

  it("shows error from server", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const formData = {
      email: "test@test.com",
      password: "testtesttesttesttest",
    };
    const errorMessageFromServer = "errorMessageFromServer";
    const mockMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: false,
          error: errorMessageFromServer,
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(errorMessageFromServer);
  });

  it("submits form and calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    const password = getByPlaceholderText(/password/i);
    const submitBtn = getByRole("button");
    const formData = {
      email: "test@test.com",
      password: "testtesttesttesttest",
    };
    const mockMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: null,
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        email: formData.email,
        password: formData.password,
      },
    });
  });
});
