import { useAppContext } from "@/context/AppContext";

export const columns = [
  {
    field: "name",
    headerName: "NAME",
    renderCell: (params) => {
      const { tableData, toggleDrawer } = useAppContext();
      const handleClick = () => {
        const event = tableData.find((row) => row.id === params.row.id);
        toggleDrawer(true, event);
      };

      return (
        <div
          onClick={handleClick}
          style={{
            cursor: "pointer",
            flex: 1,
          }}
        >
          <p style={{ margin: 0 }}>{params.row.name}</p>
          <p style={{ margin: 0, fontSize: "0.8em", color: "gray" }}>
            {params.row.description}
          </p>
        </div>
      );
    },
    flex: 1,
  },

  {
    field: "stakeholders",
    headerName: "STAKEHOLDERS",
    flex: 1,
  },
  {
    field: "category",
    headerName: "CATEGORY",
    flex: 1,
  },
  {
    field: "propertyBundles",
    headerName: "PROPERTY BUNDLES",
    flex: 1,
  },
  {
    field: "eventProperties",
    headerName: "EVENT PROPERTIES",
    flex: 1,
  },
  {
    field: "groupProperties",
    headerName: "GROUP PROPERTIES",
    flex: 1,
  },
  {
    field: "source",
    headerName: "SOURCE",
    flex: 1,
  },
  {
    field: "action",
    headerName: "ACTION",
    flex: 1,
  },
];

export const rows = [
  {
    id: 1,
    name: "Event A",
    description: "Description A",
    stakeholders: "Stakeholder A",
    category: "Category A",
    propertyBundles: "Property Bundle A",
    eventProperties: "key1:value1, key2:value2",
    groupProperties: "Group Property A",
    source: "Source A",
    action: "Action A",
  },
  {
    id: 15,
    name: "Event",
    description: "Description A",
    stakeholders: "Stakeholder A",
    category: "Category A",
    propertyBundles: "Property Bundle A",
    eventProperties: "key1:value1, key2:value2",
    groupProperties: "Group Property A",
    source: "Source A",
    action: "Action A",
  },
  {
    id: 2,
    name: "Event B",
    description: "Description B",
    stakeholders: "Stakeholder B",
    category: "Category B",
    propertyBundles: "Property Bundle B",
    eventProperties: "key3:value3, key4:value4",
    groupProperties: "Group Property B",
    source: "Source B",
    action: "Action B",
  },
  {
    id: 3,
    name: "Event C",
    description: "Description C",
    stakeholders: "Stakeholder C",
    category: "Category C",
    propertyBundles: "Property Bundle C",
    eventProperties: "key5:value5, key6:value6",
    groupProperties: "Group Property C",
    source: "Source C",
    action: "Action C",
  },
  {
    id: 4,
    name: "Event D",
    description: "Description D",
    stakeholders: "Stakeholder D",
    category: "Category D",
    propertyBundles: "Property Bundle D",
    eventProperties: "key7:value7, key8:value8",
    groupProperties: "Group Property D",
    source: "Source D",
    action: "Action D",
  },
  {
    id: 5,
    name: "Event E",
    description: "Description E",
    stakeholders: "Stakeholder E",
    category: "Category E",
    propertyBundles: "Property Bundle E",
    eventProperties: "key9:value9, key10:value10",
    groupProperties: "Group Property E",
    source: "Source E",
    action: "Action E",
  },
  {
    id: 6,
    name: "Event F",
    description: "Description F",
    stakeholders: "Stakeholder F",
    category: "Category F",
    propertyBundles: "Property Bundle F",
    eventProperties: "key11:value11, key12:value12",
    groupProperties: "Group Property F",
    source: "Source F",
    action: "Action F",
  },
  {
    id: 7,
    name: "Event G",
    description: "Description G",
    stakeholders: "Stakeholder G",
    category: "Category G",
    propertyBundles: "Property Bundle G",
    eventProperties: "key13:value13, key14:value14",
    groupProperties: "Group Property G",
    source: "Source G",
    action: "Action G",
  },
  {
    id: 8,
    name: "Event H",
    description: "Description H",
    stakeholders: "Stakeholder H",
    category: "Category H",
    propertyBundles: "Property Bundle H",
    eventProperties: "key15:value15, key16:value16",
    groupProperties: "Group Property H",
    source: "Source H",
    action: "Action H",
  },
  {
    id: 9,
    name: "Event I",
    description: "Description I",
    stakeholders: "Stakeholder I",
    category: "Category I",
    propertyBundles: "Property Bundle I",
    eventProperties: "key17:value17, key18:value18",
    groupProperties: "Group Property I",
    source: "Source I",
    action: "Action I",
  },
];
