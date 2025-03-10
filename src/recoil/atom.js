import { atom,selector } from "recoil";
    
  export const allEventsState = atom({
    key: "allEventsState",
    default: [],
  });
    

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
    set: ({ set }, newValue) => set(tableDataState, newValue),
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
export const currentOrganizationState = atom({
  key: "currentOrganizationState",
  default: null,
});

export const isEventDrawerOpenState = atom({
    key: "isEventDrawerOpenState",
    default: false,
  });
  export const isProductAnalystState = atom({
    key: "isProductAnalystState",
    default: false,
  });
  export const userPropertiesState = atom({
    key: "userPropertiesState",
    default: [], // Set an appropriate default value
  });
// Atom for managing the view state (e.g., 'list' or 'category')
export const viewState = atom({
  key: 'viewState', // Unique key for this atom
  default: 'list', // Default value
});

// Atom for managing the open state of a modal (e.g., AddEventModal)
export const openState = atom({
  key: 'openState',
  default: false, // Default is closed
});

// Atom for managing the open state of the category modal
export const categoryOpenState = atom({
  key: 'categoryOpenState',
  default: false, // Default is closed
});

// Atom for managing the selected organizations in the filter
export const selectedOrganizationsState = atom({
  key: 'selectedOrganizationsState',
  default: [], // Default is an empty array
});

// Atom for managing the open state of the source selection dialog
export const openSourceDialogState = atom({
  key: 'openSourceDialogState',
  default: false, // Default is closed
});

// Atom for managing the selected source (e.g., 'Website', 'Backend', etc.)
export const selectedSourceState = atom({
  key: 'selectedSourceState',
  default: '', // Default is an empty string
});

// Atom for managing the open state of the application setup dialog
export const openAppSetupState = atom({
  key: 'openAppSetupState',
  default: false, // Default is closed
});

// Atom for managing the new organization ID
export const newOrgIdState = atom({
  key: 'newOrgIdState',
  default: null, // Default is null
});

// Atom for managing the uploading state (e.g., during CSV upload)
export const uploadingState = atom({
  key: 'uploadingState',
  default: false, // Default is not uploading
});

// Atom for new organization name
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

export const tableDataState = atom({
  key: "tableDataState",
  default: [], // Default empty array for table data
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
    isProductAnalyst: false,
  },
});

export const organizationState = atom({
  key: 'organizationState',
  default: {
    currentOrganization: null,
    allEvents: [],
  },
});