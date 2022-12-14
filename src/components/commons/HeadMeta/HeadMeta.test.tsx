import { render } from "src/test-utils/customRender";
import { createMockRouter } from "__mocks__/createMockRouter";
import "__mocks__/headMock";
import HeadMeta, { Props } from "./HeadMeta";
import { NextRouter } from "next/router";

describe("HeadMeta", () => {
  const router = createMockRouter({
    query: { userId: "baayoo93@gmail.com", id: "idfsdfds" },
    push: jest.fn(),
  });

  const renderHeadMeta = ({
    router,
    ...rest
  }: Props & { router?: NextRouter }) =>
    render(<HeadMeta {...rest}></HeadMeta>, { router });

  it("renders title", async () => {
    renderHeadMeta({
      router,
    });

    expect(document.title).toEqual("mlog");
  });
});
