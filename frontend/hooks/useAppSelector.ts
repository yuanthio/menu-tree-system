import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export const useAppSelector = <T>(selector: (state: RootState) => T) => {
  return useSelector(selector);
};
