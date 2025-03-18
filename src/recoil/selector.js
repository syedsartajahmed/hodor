import { selector } from 'recoil';
import { tableDataState, selectedOrganizationsState } from './atom';

export const filteredTableDataState = selector({
  key: 'filteredTableDataState', // Unique ID
  get: ({ get }) => {
    const tableData = get(tableDataState); // Get the original table data
    const selectedIndustries = get(selectedOrganizationsState); // Get the selected industries

    // If no industries are selected, return the full table data
    if (selectedIndustries.length === 0) {
      return tableData;
    }

    // Filter the table data based on the selected industries
    return tableData.filter((event) =>
      selectedIndustries.includes(event.organization)
    );
  },
});