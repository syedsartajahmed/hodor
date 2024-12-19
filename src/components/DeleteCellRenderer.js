import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const DeleteCellRenderer = ({ params, page }) => {
  const { tableData, setTableData, currentOrganization } = useAppContext(); 

    const handleDelete = async () => {
        try {
            let apiEndpoint = "";
            const deltedRow = tableData.filter((row) => row.id == params.row.id);
            console.log(deltedRow[0].id)
            console.log(deltedRow)
            switch (page) {
              case "master-events":
                apiEndpoint = `/api/master-events?id=${deltedRow[0].id}`;
                break;
              case "dashboard":
                apiEndpoint = `/api/save?application_id=${currentOrganization.applicationId}&event_id=${deltedRow[0].id}`;
                break;
              default:
                console.error("Unknown page/context for deletion");
                return;
            }
      
            await axios.delete(apiEndpoint);
      
            const updatedData = tableData.filter((row) => row.id !== params.row.id);
            setTableData(updatedData);
      
            console.log(`Deleted row with ID: ${params.row.id} in context: ${page}`);
          } catch (error) {
            console.error("Error deleting row:", error);
          }
  };

  return (
    <div onClick={handleDelete} style={{ cursor: "pointer" }}>
      <DeleteIcon color="error" />
    </div>
  );
};

export default DeleteCellRenderer;
