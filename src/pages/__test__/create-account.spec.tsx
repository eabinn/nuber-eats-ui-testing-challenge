import { render, waitFor } from "../../test-utils";
import React from "react";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/extend-expect";
import { UserRole } from "../../__type_graphql__/globalTypes";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });

  it("renders OK", async () => {
    await waitFor(() => expect(document.title).toBe("Create Account | Nuber-podcasts"));
  });

  it("renders not valid email error", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    const button = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "wont@work");
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email address invalid/i);
  });

  it("renders email required error", async () => {
    const { getByRole, getByPlaceholderText } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    const button = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "wont@work");
      userEvent.clear(email);
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Email is required!/i);
  });

  it("renders password not match error", async () => {
    const { getByRole, getByPlaceholderText, getByText } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    const password = getByPlaceholderText(/password/i);
    const passwordConfirm = getByPlaceholderText(/confirm/i);
    const button = getByRole("button");

    await waitFor(() => {
      userEvent.type(email, "working@email.com");
      userEvent.type(password, "aaaaaaaaaaaaa");
      userEvent.type(passwordConfirm, "bbbbbbbbbbbbb");
      userEvent.click(button);
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password not matched/i);
  });

  it("submits mutation with form values", async () => {
    const { getByRole, getByPlaceholderText, container } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    const password = getByPlaceholderText(/password/i);
    const passwordConfirm = getByPlaceholderText(/confirm/i);
    const role = container.querySelector("select") as HTMLElement;
    const button = getByRole("button");
    const formData = {
      email: "working@mail.com",
      password: "workingPassword",
      role: UserRole.Listener,
    };
    const mockedCreateAccountMutation = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: null,
        },
      },
    });
    mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedCreateAccountMutation);
    jest.spyOn(window, "alert").mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.type(passwordConfirm, formData.password);
      userEvent.selectOptions(role, formData.role);
      userEvent.click(button);
    });
    expect(mockedCreateAccountMutation).toHaveBeenCalledTimes(1);
    expect(mockedCreateAccountMutation).toHaveBeenCalledWith({
      createAccountInput: {
        email: formData.email,
        password: formData.password,
        role: formData.role,
      },
    });
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("shows error from server", async () => {
    const { getByRole, getByPlaceholderText, container } = renderResult;
    const email = getByPlaceholderText(/e\-mail/i);
    const password = getByPlaceholderText(/password/i);
    const passwordConfirm = getByPlaceholderText(/confirm/i);
    const role = container.querySelector("select") as HTMLElement;
    const button = getByRole("button");
    const formData = {
      email: "working@mail.com",
      password: "workingPassword",
      role: UserRole.Listener,
    };
    const errorMessageFromServer = "errorMessageFromServer";
    const mockedCreateAccountMutation = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: false,
          error: errorMessageFromServer,
        },
      },
    });
    mockedClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, mockedCreateAccountMutation);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.type(passwordConfirm, formData.password);
      userEvent.selectOptions(role, formData.role);
      userEvent.click(button);
    });
    let errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent(errorMessageFromServer);
  });
});
