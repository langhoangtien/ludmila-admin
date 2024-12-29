import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import {
  Box,
  Paper,
  Button,
  Collapse,
  TableHead,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import axiosInstance, { encodeData } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ConfirmDialog } from '../custom-dialog';

// ----------------------------------------------------------------------

// const TABLE_DATA = x;

// ----------------------------------------------------------------------

export default function ApiTable({
  apiURL,
  mapFunction,
  tableHead,
  moduleName = 'Sản phẩm',
  reload = false,
}) {
  const [loading, setLoading] = useState(true);

  const [text, setText] = useState('');
  const debounceText = useDebounce(text, 600);
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('createdAt');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [count, setCount] = useState(0);
  const confirmRows = useBoolean();
  const onSort = (id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const onSelectRow = (inputValue) => {
    const newSelected = selected.includes(inputValue)
      ? selected.filter((value) => value !== inputValue)
      : [...selected, inputValue];

    setSelected(newSelected);
  };

  const onChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const onChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const onSelectAllRows = (checked, inputValue) => {
    if (checked) {
      setSelected(inputValue);
      return;
    }
    setSelected([]);
  };

  const onChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [tableData, setTableData] = useState([]);
  const onChangeText = (event) => {
    setText(event.target.value);
  };

  // GỌI API
  const fetchData = async () => {
    setLoading(true);
    try {
      const limit = rowsPerPage;
      const skip = rowsPerPage * page;
      const sort = encodeData({ orderBy, order });
      const filter = encodeData({
        $or: tableHead
          .filter((i) => i.search)
          .map((item) => ({ [item.id]: { $regex: debounceText, $options: 'i' } })),
      });
      const url = `${apiURL}?limit=${limit}&skip=${skip}&sort=${sort}&filter=${filter}`;
      const response = await axiosInstance.get(url);
      const { data } = response;
      const { items } = data;
      const totalCount = data.count;
      const dataMapped = items.map((item) => mapFunction(item));
      setTableData(dataMapped);
      setCount(totalCount);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const fetchDataCallback = useCallback(fetchData, [
    rowsPerPage,
    page,
    orderBy,
    order,
    tableHead,
    apiURL,
    debounceText,
    mapFunction,
  ]);
  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  const denseHeight = dense ? 34 : 34 + 20;
  const handleDeleteRows = async () => {
    try {
      if (selected.length === 1) await axiosInstance.delete(`${apiURL}/${selected[0]}`);
      else await axiosInstance.delete(`${apiURL}/remove-many?ids=${encodeData(selected)}`);
      enqueueSnackbar('Delete success!');
      setSelected([]);
      fetchData();
    } catch (error) {
      enqueueSnackbar('Delete failed!', { variant: 'error' });
    }
  };
  return (
    <div>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}> */}
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-start' }}
        justifyContent={{ md: 'center' }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        <Typography variant="h6">{moduleName}</Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ width: 1 }}
        >
          <TextField
            value={text}
            size="small"
            placeholder="Search product name, code,tags,..."
            onChange={onChangeText}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />

          <Tooltip title="Filter list">
            <IconButton>
              <Iconify icon="ic:round-filter-list" />
            </IconButton>
          </Tooltip>

          {/* <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </Stack>
      </Stack>

      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { md: 480, xs: 280 },
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                tableData.map((row) => row._id)
              )
            }
            action={
              <Tooltip on title="Delete">
                <IconButton onClick={confirmRows.onTrue} color="primary">
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Tooltip>
            }
          />

          <Scrollbar>
            <Table size={dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={tableHead}
                rowCount={count}
                numSelected={selected.length}
                onSort={onSort}
                onSelectAllRows={(checked) =>
                  onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id)
                  )
                }
              />

              <TableBody>
                {tableData.map((row) => (
                  <CollapsibleTableRow
                    tableHead={tableHead}
                    row={row}
                    selected={selected.includes(row._id)}
                    onSelectRow={() => onSelectRow(row._id)}
                    checked={selected.includes(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page, rowsPerPage, count)}
                />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      )}

      <TablePaginationCustom
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        onChangeDense={onChangeDense}
      />
      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Xóa"
        content={
          <>
            Chắc chắn bạn muốn xóa <strong> {selected.length} </strong> mục?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Xóa
          </Button>
        }
      />
    </div>
  );
}

ApiTable.propTypes = {
  apiURL: PropTypes.string,
  mapFunction: PropTypes.func,
  tableHead: PropTypes.array,
  reload: PropTypes.bool,
  moduleName: PropTypes.string,
};

function CollapsibleTableRow({ row, checked, selected, onSelectRow, tableHead }) {
  const collapsible = useBoolean();

  return (
    <>
      <TableRow hover key={row.id} selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox onClick={onSelectRow} checked={checked} />
        </TableCell>

        {tableHead.map((cell) =>
          cell.id === 'children' ? (
            <TableCell>
              {row.children && (
                <IconButton
                  size="small"
                  color={collapsible.value ? 'inherit' : 'default'}
                  onClick={collapsible.onToggle}
                >
                  <Iconify
                    icon={
                      collapsible.value
                        ? 'eva:arrow-ios-upward-fill'
                        : 'eva:arrow-ios-downward-fill'
                    }
                  />
                </IconButton>
              )}
            </TableCell>
          ) : (
            <TableCell align={cell.align}>{row[cell.id]}</TableCell>
          )
        )}
      </TableRow>
      {row.children && (
        <TableRow>
          <TableCell sx={{ py: 0 }} colSpan={6}>
            <Collapse in={collapsible.value} unmountOnExit>
              <Paper
                variant="outlined"
                sx={{
                  py: 2,
                  borderRadius: 1.5,
                  ...(collapsible.value && {
                    boxShadow: (theme) => theme.customShadows.z20,
                  }),
                }}
              >
                <Typography variant="h6" sx={{ m: 2, mt: 0 }}>
                  children
                </Typography>

                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Total price ($)</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {row.children.map((childrenRow) => (
                      <TableRow key={childrenRow.date}>
                        <TableCell component="th" scope="row">
                          {childrenRow.date}
                        </TableCell>
                        <TableCell>{childrenRow.customerId}</TableCell>
                        <TableCell align="right">{childrenRow.amount}</TableCell>
                        <TableCell align="right">
                          {Math.round(childrenRow.amount * row.price * 100) / 100}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

CollapsibleTableRow.propTypes = {
  row: PropTypes.object,
  checked: PropTypes.bool,
  selected: PropTypes.array,
  onSelectRow: PropTypes.func,
  tableHead: PropTypes.array,
};

// ----------------------------------------------------------------------
