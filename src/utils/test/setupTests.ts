/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import { vi } from "vitest";
import path from "path";
import dotenv from "dotenv";
import React from "react";

dotenv.config({ path: path.resolve(__dirname, "../../.env.test") });
vi.mock("next/navigation");
vi.mock("@/hooks/useAuth");

vi.mock("next/image", () => ({
  default: (props: any) => {
    return React.createElement("img", props);
  },
}));
