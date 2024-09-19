'use client'
import { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { SelectChangeEvent } from '@mui/material';
import { Avatar, Button, Dialog, DialogContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography, FormHelperText } from '@mui/material';
import Box from '@mui/material/Box';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { DriveFileRenameOutlineOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from '@/redux/store';
import { fetchAssests, filterAssest } from '@/redux/features/assests/assestsSlice';
import { fetchEmployees } from '@/redux/features/employees/employeesSlice';
import { apiResponse } from '@/utility/apiResponse/employeesResponse';



export default function AssestsGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { assests, loading, error, filteredAssest, total } = useSelector((state: RootState) => state.assests);

  // const { employees } = useSelector((state: RootState) => state.employees)
  const [showForm, setShowForm] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const [employees, setEmployees] = useState([])
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [userId, setUserId] = useState<string>("");

  console.log('assests', assests);

  const debouncedFetch = useCallback(
    debounce(() => {
      dispatch(fetchAssests({ page, limit, keyword: selectedKeyword }));
    }, 300),
    [page, limit, selectedKeyword]
  );

  useEffect(() => {
    debouncedFetch();

    return debouncedFetch.cancel;
  }, [page, limit, selectedKeyword, debouncedFetch]);

  const handleInputChange = (e) => {
    setSelectedKeyword(e.target.value);
  };

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage + 1);
    setLimit(newPageSize);
  };

  const handlePaginationModelChange = (params: { page: number; pageSize: number }) => {
    handlePageChange(params.page, params.pageSize);
    debouncedFetch();
  };

  // const apiResponse = async () => {
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_APP_URL}/employees/get?page=${page}&limit=${limit}`
  //   );

  //   const employees = await response.json();

  //   console.log('employees is ', employees)

  //   setEmployees(employees)
  // }

  useEffect(() => {
    if (assests.length === 0) {
      dispatch(fetchAssests({ page, limit, keyword: selectedKeyword }))
    }

    // Fetch employees and set the state
    const fetchEmployees = async () => {
      const data = await apiResponse();

      setEmployees(data);
    };

    fetchEmployees();
  }, [dispatch, assests?.length, page, limit, selectedKeyword]);

  // const handlePageChange = (newPage, newPageSize) => {
  //   setPage(newPage + 1); // Page index starts from 0, so increment by 1
  //   setLimit(newPageSize); // Update the limit with the new page size
  //   dispatch(fetchAssests({ page: newPage + 1, limit: newPageSize })); // Dispatch the action with the updated page and limit
  // };

  // const handlePaginationModelChange = (params) => {
  //   handlePageChange(params.page, params.pageSize); // Pass page and pageSize to the handler
  // };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}')

    setUserRole(user.role)
    setUserId(user.id);
  })

  const AddAssetForm: React.FC<AddAssetFormProps> = ({ handleClose, asset }) => {
    const [formData, setFormData] = useState({
      employee: '',
      description: '',
      model: '',
      name: '',
      sno: '',
      type: '',
      assignment_date: '',
      return_date: '',
    })

    const [errors, setErrors] = useState({
      employee: '',
      description: '',
      model: '',
      name: '',
      sno: '',
      type: '',
      assignment_date: '',
      return_date: ''
    });

    useEffect(() => {
      if (asset) {
        const selected = assests.find(ast => ast._id === asset);

        if (selected) {
          setFormData({
            employee: selected.employee._id,
            description: selected.description,
            model: selected.model,
            name: selected.name,
            sno: selected.sno,
            type: selected.type,
            assignment_date: selected.assignment_date,
            return_date: selected.return_date,
          })
        }
      }
    }, [asset, assests])

    const validateForm = () => {
      let isValid = true;

      const newErrors = {
        employee: '',
        description: '',
        model: '',
        name: '',
        sno: '',
        type: '',
        assignment_date: '',
        return_date: ''
      };

      if (!formData.employee.trim()) {
        newErrors.employee = 'Employee is not selected';
        isValid = false;
      }

      if (!formData.description.trim()) {
        newErrors.description = 'Required';
        isValid = false;
      }

      if (!formData.model.trim()) {
        newErrors.model = 'Required';
        isValid = false;
      }

      if (!formData.name.trim()) {
        newErrors.name = 'Required';
        isValid = false;
      }

      if (!formData.sno.trim()) {
        newErrors.sno = 'Required';
        isValid = false;
      }

      if (!formData.type.trim()) {
        newErrors.type = 'Type is not defined';
        isValid = false;
      }

      if (!formData.assignment_date.trim()) {
        newErrors.assignment_date = 'Date is required';
        isValid = false;
      }

      if (!formData.return_date.trim()) {
        newErrors.return_date = 'Date is required';
        isValid = false;
      }

      setErrors(newErrors);

      return isValid;
    };

    const handleTextFieldChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
      const { name, value } = e.target;

      setFormData(prevState => ({
        ...prevState,
        [name as string]: value,
      }));
    };

    const handleSubmit = () => {
      if (validateForm()) {
        const method = asset ? 'PUT' : 'POST'
        const url = asset ? `${process.env.NEXT_PUBLIC_APP_URL}/assests/update/${asset}` : `${process.env.NEXT_PUBLIC_APP_URL}/assests/create`

        console.log('Submitting form data:', formData);
        fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
          .then(response => response.json())
          .then(data => {
            if (data.message) {
              if (data.message.includes('success')) {
                toast.success(data.message, {
                  position: 'top-center',
                });
              } else {
                toast.error('Error: ' + data.message, {
                  position: 'top-center',
                });
              }
            } else {
              toast.error('Unexpected error occurred', {
                position: 'top-center',
              });
            }

            handleClose();
            dispatch(fetchAssests({ page, limit, keyword: selectedKeyword }));
          })
          .catch(error => {
            console.log('Error', error);
          });
      }
    };

    return (
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
            {asset ? 'Edit Asset' : 'Add Asset'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel required id='demo-simple-select-label'>Employee</InputLabel>
              <Select
                label='Select Employee'
                labelId='demo-simple-select-label'
                id='demo-simple-select'
                name="employee"
                value={formData.employee}
                onChange={handleSelectChange}
                required
                error={!!errors.employee}
              >
                {employees.map((employee) => (
                  <MenuItem key={employee._id} value={employee._id}>
                    {employee.first_name} {employee.last_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.employee && <FormHelperText error>{errors.employee}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Model'
              name='model'
              value={formData.model}
              onChange={handleTextFieldChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Asset Name'
              name='name'
              value={formData.name}
              onChange={handleTextFieldChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='SNO'
              name='sno'
              value={formData.sno}
              onChange={handleTextFieldChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Type'
              name='type'
              value={formData.type}
              onChange={handleTextFieldChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Description'
              name='description'
              value={formData.description}
              onChange={handleTextFieldChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Assignment Date'
              name='assignment_date'
              value={formData.assignment_date}
              type='date'
              onChange={handleTextFieldChange}
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label='Return Date'
              name='return_date'
              value={formData.return_date}
              type='date'
              onChange={handleTextFieldChange}
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: 'white',
                padding: 15,
                backgroundColor: '#ff902f',
                width: 200
              }}
              variant='contained'
              fullWidth
              onClick={handleSubmit}
            >
              {asset ? 'UPDATE ASSET' : 'ADD ASSET'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    )
  }

  const handleAssetAddClick = () => {
    setSelectedAsset("")
    setShowForm(true)
  }

  const handleEditAssetClick = (id: string) => {
    setSelectedAsset(id)
    setShowForm(true)
  }

  const handleClose = () => {
    setShowForm(false)
  }

  const generateColumns = () => {
    const columns: GridColDef[] = [
      ...(userRole === '1' ? [{
        field: 'employee_name',
        headerName: 'Employee',
        width: 220,
        headerClassName: 'super-app-theme--header',
        sortable: true,
        align: 'center',
        renderCell: (params) => {

          const textStyle = {
            fontSize: '1em',
            fontWeight: 'bold',
          };

          return (
            <Box display="flex" alignItems="center">
              <Avatar src={params.row.employee_image} alt={params.row.employee_name} sx={{ mr: 2 }} />
              <Typography sx={textStyle}>{params.row.employee_name}</Typography>
            </Box>
          );
        },
      }] : []),

      {
        field: 'name',
        headerName: 'Asset Name',
        width: 180,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'model',
        headerName: 'Model Name',
        width: 180,
        editable: true,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'sno',
        headerName: 'SNO',
        width: 180,
        editable: true,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 250,
        editable: true,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'type',
        headerName: 'Type',
        width: 150,
        editable: true,
        headerClassName: 'super-app-theme--header',
      },
      {
        field: 'assignment_date',
        headerName: 'Assign Date',
        type: 'string',
        width: 180,
        editable: true,
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        align: 'center',
      },
      {
        field: 'return_date',
        headerName: 'Return Date',
        type: 'string',
        width: 180,
        editable: true,
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        align: 'center',
      },
      ...(userRole === '1'
        ? [{
          field: 'edit',
          headerName: 'Action',
          sortable: false,
          headerAlign: 'center',
          width: 160,
          headerClassName: 'super-app-theme--header',
          renderCell: (params: GridRenderCellParams) => (
            <Box width="85%" m="0 auto" p="5px" display="flex" justifyContent="space-around">
              <Button color="info" variant="contained" sx={{ minWidth: "50px" }} onClick={() => handleEditAssetClick(params.row._id)}>
                <DriveFileRenameOutlineOutlined />
              </Button>
            </Box>
          ),
        }]
        : [])
    ];

    return columns;
  }

  interface GroupedData {
    _id: string;
    employee_id: string;
    employee_name: string;
    employee_image: string;
    description: string;
    model: string;
    name: string;
    sno: string;
    type: string;
    assignment_date: string;
    return_date: string;
  }

  const transformData = (): GroupedData[] => {
    let assestSource = Array.isArray(filteredAssest) && filteredAssest.length > 0 ? filteredAssest : Array.isArray(assests) ? assests : [];

    if (Number(userRole) >= 2) {

      assestSource = assestSource.filter(asset => asset.employee && asset.employee._id === userId);
    }

    if (!Array.isArray(assestSource) || assestSource.length === 0) {
      return [];
    }

    const groupedData = assestSource.reduce<GroupedData[]>((acc, curr) => {
      const { employee, description, model, name, sno, type, assignment_date, return_date, _id } = curr;

      if (!employee) {
        return acc;
      }

      acc.push({
        _id,
        employee_id: employee._id,
        employee_name: `${employee.first_name} ${employee.last_name}`,
        employee_image: employee.image,
        description,
        model,
        name,
        sno,
        type,
        assignment_date,
        return_date,
      });

      return acc;
    }, []);

    return groupedData;
  };

  const columns = generateColumns();
  const rows = transformData();

  return (
    <>
      <ToastContainer />
      <Box sx={{ flexGrow: 1, padding: 2 }}>
        <Dialog open={showForm} onClose={handleClose} fullWidth maxWidth='md'>
          <DialogContent>
            <AddAssetForm asset={selectedAsset} handleClose={handleClose} />
          </DialogContent>
        </Dialog>
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
          <Box>
            <Typography style={{ fontSize: '2em' }} variant='h5' gutterBottom>
              Assets
            </Typography>
            <Typography
              style={{ fontSize: '1em', fontWeight: 'bold' }}
              variant='subtitle1'
              gutterBottom
            >
              Dashboard / Assets
            </Typography>
          </Box>
          {userRole === "1" && <Box display='flex' alignItems='center'>
            <Button
              style={{ borderRadius: 50, backgroundColor: '#ff902f' }}
              variant='contained'
              color='warning'
              startIcon={<AddIcon />}
              onClick={handleAssetAddClick}
            >
              Add Asset
            </Button>
          </Box>}
        </Box>
        {userRole === "1" && <Grid container spacing={6} alignItems='center' mb={2}>
          {/* <Grid item xs={12} md={3}>
            <TextField fullWidth label='Employee ID' variant='outlined' />
          </Grid> */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="search"
              variant="outlined"
              value={selectedKeyword}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* <Grid item xs={12} md={3}>
            <Button style={{ padding: 15, backgroundColor: '#198754' }} variant='contained' fullWidth>
              SEARCH
            </Button>
          </Grid> */}
        </Grid>}
      </Box>
      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          sx={{
            '& .super-app-theme--header': {
              fontSize: 17,

              fontWeight: 600,
              alignItems: 'center'
            },
            '& .MuiDataGrid-cell': {
              fontSize: '10',

              align: 'center',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: 'rgb(46 38 61 / 12%)',
              },
              '&:nth-of-type(even)': {
                backgroundColor: '#fffff',
              },

              fontWeight: '600',
              fontSize: '14px',
              boxSizing: 'border-box'
            },
          }}
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          paginationMode="server"
          rowCount={total}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 20, 30]}
          paginationModel={{ page: page - 1, pageSize: limit }}
          checkboxSelection
          disableRowSelectionOnClick
        />

      </Box>
    </>
  );
}
