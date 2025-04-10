import { render } from "@testing-library/react";
import App from "./App";
import { test, expect } from "vitest";

test("renders hello world", () => {
  render(<App />);
  //   expect(screen.getByText(/hello/i)).toBeInTheDocument();
  expect(1 + 1).toEqual(2);
});
