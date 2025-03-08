import { atom, useRecoilValue } from "recoil";
import NameCellRenderer from "@/components/NameCellRender";

export const columns = [
  { Header: "Name", accessor: "name" },
  { Header: "Email", accessor: "email" },
  // Add other columns here
];
export const useColumns = () => {
  return useRecoilValue(columnsState);
};
