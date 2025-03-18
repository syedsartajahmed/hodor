import { atom,selector } from "recoil";    

export const showListState = atom({
    key: "showListState",
    default: false, // or true, depending on what you need
  });

export const selectedEventState = atom({
    key: "selectedEventState",
    default: {
      name: "",
      description: "",
      category: "",
      stakeholders: [],
      platform: [],
      source: [],
      items: [
        {
          user_property: [],
          event_property: [],
          super_property: [],
        },
      ],
    },
  });
  
  // Atom for event properties
  export const eventPropertiesState = atom({
    key: "eventPropertiesState",
    default: [
      {
        name: "",
        value: "",
        property_definition: "",
        type: "String",
        sample_value: "",
        method_call: "Track",
      },
    ],
  });
  
  // Atom for super properties
  export const superPropertiesState = atom({
    key: "superPropertiesState",
    default: [{ name: "", value: "" }],
  });
  export const addEventSelector = selector({
    key: "addEventSelector",
    get: ({ get }) => get(tableDataState),
    set: ({ set, get }, newEvent) => {
      const currentTableData = get(tableDataState);
      const updatedTableData = Array.isArray(currentTableData)
        ? [...currentTableData, { ...newEvent, id: Date.now() }] // Add a unique id
        : [{ ...newEvent, id: Date.now() }]; // Add a unique id
      set(tableDataState, updatedTableData);
    },
  });
  
  export const categoriesState = atom({
    key: "categoriesState",
    default: [], // Adjust the default value as needed
  });
  
  export const selectedOrganizationState = atom({
    key: "selectedOrganizationState",
    default: null,
  });  
// State to store the list of organizations
export const organizationsState = atom({
  key: "organizationsState",
  default: [],
});
export const applicationSetupState = atom({
    key: "applicationSetupState",
    default: {},
  });
// State to store the currently selected organization
export const isEventDrawerOpenState = atom({
    key: "isEventDrawerOpenState",
    default: false,
  });
export const userPropertiesState = atom({
    key: "userPropertiesState",
    default: [], // Set an appropriate default value
  });

  export const newOrgIdState = atom({
  key: 'newOrgIdState',
  default: null, // Default is null
});

export const newOrganizationNameState = atom({
  key: "newOrganizationNameState",
  default: "", // Default value is an empty string
});
export const drawerState = atom({
  key: 'drawerState',
  default: {
    isOpen: false,
    selectedEvent: null,
  },
});
// Atom for open/close add organization dialog
export const openAddDialogState = atom({
  key: "openAddDialogState",
  default: false, // Default value is false
});

// Atom for open/close delete organization dialog
export const openDeleteDialogState = atom({
  key: "openDeleteDialogState",
  default: false, // Default value is false
});

// Define Recoil atoms
export const environmentState = atom({
  key: 'environmentState',
  default: 'Frontend',
});

export const instructionsState = atom({
  key: 'instructionsState',
  default: '',
});

export const initCodeState = atom({
  key: 'initCodeState',
  default: '',
});

export const tokenState = atom({
  key: 'tokenState',
  default: '',
});



export const isDrawerOpenState = atom({
  key: "isDrawerOpenState",
  default: { open: false, event: null }, // Initial drawer state
});

// Left drawer (Organization)
export const isOrgDrawerOpenState = atom({
  key: "isOrgDrawerOpenState",
  default: false,
});


export const eventDrawerState = atom({
  key: 'eventDrawerState',
  default: {
    isEventDrawerOpen: false,
    selectedEvent: null,
    isProductAnalyst: false, // Ensure this is included
  },
});

// Define your selector
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
export const stakeholdersState = atom({
  key: 'stakeholdersState',
  default: [],
});

export const categoryState = atom({
  key: 'categoryState',
  default: "",
});

export const descriptionState = atom({
  key: 'descriptionState',
  default: "",
});

export const actionState = atom({
  key: 'actionState',
  default: "",
});

export const platformsState = atom({
  key: 'platformsState',
  default: [],
});

export const sourceState = atom({
  key: 'sourceState',
  default: [],
});

export const organizationState = atom({
  key: 'organizationState',
  default: "",
});

export const isProductAnalystState = atom({
  key: 'isProductAnalystState',
  default: false, // Default value
});

// recoil/atoms.js

// Atom for table data

// Atom for current organization
export const currentOrganizationState = atom({
  key: 'currentOrganizationState',
  default: null, // Default value is null
});

// Atom for all events
export const allEventsState = atom({
  key: 'allEventsState',
  default: [], // Default value is an empty array
});

// Atom for managing table data
export const tableDataState = atom({
  key: "tableDataState", // unique ID for the atom
  default: [], // default value
});

// Atom for managing selected view
export const viewState = atom({
  key: "viewState",
  default: "list", // default value (could be 'category', 'list', etc.)
});

// Atom for managing whether to show the modal or not
export const openState = atom({
  key: "openState",
  default: false,
});

// Atom for managing category modal state
export const categoryOpenState = atom({
  key: "categoryOpenState",
  default: false,
});

// Atom for managing selected organizations
export const selectedOrganizationsState = atom({
  key: "selectedOrganizationsState",
  default: [],
});

// Atom for managing open source dialog state
export const openSourceDialogState = atom({
  key: "openSourceDialogState",
  default: false,
});

// Atom for managing selected source for download
export const selectedSourceState = atom({
  key: "selectedSourceState",
  default: "",
});

// Atom for managing app setup modal state
export const openAppSetupState = atom({
  key: "openAppSetupState",
  default: false,
});

// Atom for managing file upload state
export const uploadingState = atom({
  key: "uploadingState",
  default: false,
});
addEventSelector