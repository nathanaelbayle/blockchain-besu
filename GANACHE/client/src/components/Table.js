import React from "react";
import "./Table.css";
import MaterialTable from "material-table";

export default function Table({ Candidates }) {
  
  return (
    <div className="table_style">
      <MaterialTable
        columns={[
          { title: "ID.", field: "id" },
          { title: "Nom", field: "name" },
        ]}
        data={
          query =>
            new Promise ( ( resolve ) => {
              resolve({
                data: Candidates,
              });
            })
        }
        title="Candidate"
        options={{
          search: false,
          paging: false,
          sorting: false,
          // selection: true,
          rowStyle: { height: 39.5 },
        }}
        localization={{
          header: {
            actions: "Choose",
          },
        }}
      />
    </div>
  );
}