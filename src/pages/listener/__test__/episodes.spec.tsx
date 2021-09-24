import { render, waitFor } from "../../../test-utils";
import React from "react";
import { Episodes, GET_EPISODES_QUERY } from "../episodes";
import { ApolloProvider } from "@apollo/client";
import { RenderResult } from "@testing-library/react";
import { createMockClient, MockApolloClient } from "mock-apollo-client";

describe("<Episodes />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      mockedClient.setRequestHandler(GET_EPISODES_QUERY, () =>
        Promise.resolve({
          data: {
            getPodcast: {
              ok: true,
              error: null,
              podcast: {
                __typename: "Podcast",
                id: 1,
                title: "title",
                category: "category",
                thumbnailUrl: "thumbnailUrl",
                description: "description",
                rating: 1,
              },
            },
            getEpisodes: {
              ok: true,
              error: null,
              episodes: [
                {
                  __typename: "Podcast",
                  title: "title",
                  description: "description",
                },
              ],
            },
          },
        })
      );
      renderResult = render(
        <ApolloProvider client={mockedClient}>
          <Episodes />
        </ApolloProvider>
      );
    });
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Episode List | Nuber-podcasts");
    });
  });
});
