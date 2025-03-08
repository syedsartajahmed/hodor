import { atom, selector } from 'recoil';

export const tableDataState = atom({
  key: 'tableDataState',
  default: [],
});

export const selectedOrganizationState = atom({
  key: 'selectedOrganizationState',
  default: null,
});

export const isOrgDrawerOpenState = atom({
  key: 'isOrgDrawerOpenState',
  default: false,
});

export const isEventDrawerOpenState = atom({
  key: 'isEventDrawerOpenState',
  default: false,
});

export const selectedEventState = atom({
  key: 'selectedEventState',
  default: null,
});

export const isDrawerOpenState = atom({
  key: 'isDrawerOpenState',
  default: false,
});

export const showListState = atom({
  key: 'showListState',
  default: false,
});

export const currentOrganizationState = atom({
  key: 'currentOrganizationState',
  default: {
    id: null,
    name: null,
    applicationId: null,
    applicationDetails: {},
  },
});

export const allEventsState = atom({
  key: 'allEventsState',
  default: [],
});

export const isProductAnalystState = atom({
  key: 'isProductAnalystState',
  default: true,
});

export const toggleOrgDrawerSelector = selector({
  key: 'toggleOrgDrawerSelector',
  get: ({ get }) => get(isOrgDrawerOpenState),
  set: ({ set }, newValue) => set(isOrgDrawerOpenState, newValue),
});

export const toggleEventDrawerSelector = selector({
  key: 'toggleEventDrawerSelector',
  get: ({ get }) => get(isEventDrawerOpenState),
  set: ({ set }, { open, event = null }) => {
    set(isEventDrawerOpenState, open);
    set(selectedEventState, event);
  },
});

export const addEventSelector = selector({
  key: 'addEventSelector',
  get: ({ get }) => get(tableDataState),
  set: ({ set, get }, event) => {
    const prevTableData = get(tableDataState);
    set(tableDataState, [
      ...prevTableData,
      {
        id: Date.now(),
        ...event,
        stakeholders: '',
        category: '',
        source: '',
        action: '',
        platform: '',
      },
    ]);
  },
});
