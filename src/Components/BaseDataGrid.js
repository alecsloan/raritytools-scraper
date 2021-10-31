import React, {useState} from 'react'
import {DataGrid} from "@mui/x-data-grid";

function BaseDataGrid (props) {
  const [page, setPage] = useState(props.page || 0);
  const [pageSize, setPageSize] = useState(props.pageSize || 20);
  const [sortModel, setSortModel] = useState([{field: 'ethPerRarity', sort: 'asc'}]);

  return (
      <DataGrid
        autoHeight
        columnBuffer={props.columns.length}
        disableColumnSelector
        disableSelectionOnClick
        onPageChange={(newPage) => setPage(newPage)}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        page={page}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 30, 40, 50]}
        onSortModelChange={(newSortModel, details) => {
          setSortModel(newSortModel);
        }}
        sortModel={sortModel}
        style={{
          margin: 'auto',
          marginTop: '50px',
          width: '80%',
          color: props.theme.palette.mode === "dark" ? 'white' : 'black'
        }}
        {...props}
      />
  );
}

export default BaseDataGrid;