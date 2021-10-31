import React, {useState} from 'react'
import {DataGrid} from "@mui/x-data-grid";

function BaseDataGrid (props) {
  const [page, setPage] = useState(props.page || 0);
  const [pageSize, setPageSize] = useState(props.pageSize || 20);
  const [sortModel, setSortModel] = useState([{field: 'ethPerRarity', sort: 'asc'}]);

  return (
      <DataGrid
        autoHeight
        columns={props.columns}
        columnBuffer={props.columns.length}
        disableColumnSelector
        disableSelectionOnClick
        onPageChange={(newPage) => props.setPage(newPage) || setPage(newPage)}
        onPageSizeChange={(newPageSize) => props.setPageSize(newPageSize) || setPageSize(newPageSize)}
        page={page}
        pageSize={pageSize}
        rows={props.rows}
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
      />
  );
}

export default BaseDataGrid;