import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

export const SectionContext = createContext<{
  sectionStatus: "feeds" | "comments";
  setSectionStatus: Dispatch<SetStateAction<"feeds" | "comments">>;
}>({
  sectionStatus: "feeds",
  setSectionStatus: () => {},
});