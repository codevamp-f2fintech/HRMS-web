'use client'
import { useCallback, useEffect, useState } from 'react';

import { debounce } from 'lodash';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type { SelectChangeEvent } from '@mui/material';
import { Avatar, Button, Dialog, DialogContent, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography, FormHelperText, Autocomplete } from '@mui/material';
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
import { fetchAddAssets } from '@/redux/features/addAssets/addAssetsSlice';
import { apiResponse } from '@/utility/apiResponse/employeesResponse';



export default function AssestsGrid() {
  const dispatch: AppDispatch = useDispatch();
  const { assests, loading, error, filteredAssest, total } = useSelector((state: RootState) => state.assests);

  const [showForm, setShowForm] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
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
  useEffect(() => {
    if (assests.length === 0) {
      dispatch(fetchAssests({ page, limit, keyword: selectedKeyword }))
    }
  }, [dispatch, assests?.length, page, limit, selectedKeyword]);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || '{}')

    setUserRole(user.role)
    setUserId(user.id);
  })

  const AddAssetForm: React.FC<AddAssetFormProps> = ({ handleClose, asset }) => {
    const { employees } = useSelector((state: RootState) => state.employees)
    const { addassets } = useSelector((state: RootState) => state.addAssets);

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

    useEffect(() => {
      dispatch(fetchEmployees({ page: 1, limit: 0, search: "" }))
      console.log("employee", employees)

    }, [])

    useEffect(() => {
      dispatch(fetchAddAssets({ page: 1, limit: 0, keyword: "" }))
    }, [])

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

      // if (!formData.description.trim()) {
      //   newErrors.description = 'Required';
      //   isValid = false;
      // }

      // if (!formData.model.trim()) {
      //   newErrors.model = 'Required';
      //   isValid = false;
      // }

      if (!formData.name.trim()) {
        newErrors.name = 'Required';
        isValid = false;
      }

      // if (!formData.sno.trim()) {
      //   newErrors.sno = 'Required';
      //   isValid = false;
      // }

      // if (!formData.type.trim()) {
      //   newErrors.type = 'Type is not defined';
      //   isValid = false;
      // }

      // if (!formData.assignment_date.trim()) {
      //   newErrors.assignment_date = 'Date is required';
      //   isValid = false;
      // }

      // if (!formData.return_date.trim()) {
      //   newErrors.return_date = 'Date is required';
      //   isValid = false;
      // }

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
            console.log('data', data)
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
              <Autocomplete
                id='Select Employee'
                options={
                  employees
                    .slice()
                    .sort((a, b) => {
                      const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                      const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                      return nameA.localeCompare(nameB);
                    })
                }
                getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
                renderInput={(params) => (
                  <TextField {...params} label="Select Employee" variant="outlined" />
                )}
                value={employees.find(emp => emp._id === formData.employee) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleSelectChange({ target: { name: "employee", value: newValue._id } });
                  }
                }}
              />
              {errors.employee && (
                <Typography color="error">{errors.employee}</Typography>
              )}
            </FormControl>

          </Grid>
          {/* <Grid item xs={12} md={6}>
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
          </Grid> */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <Autocomplete
                id="Select Assets"
                options={addassets
                  .slice()
                  .sort((a, b) => {
                    const nameA = `${a.assetName}`.toLowerCase();
                    const nameB = `${b.assetName}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                  })}
                getOptionLabel={(option) => `${option.assetName}-${option.model}-${option.serialNo}`}
                renderOption={(props, option) => (
                  <li {...props} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ width: '100%', textAlign: 'center' }}>{option.assetName}</span>
                    <span style={{ width: '100%', textAlign: 'center' }}>{option.model}</span>
                    <span style={{ width: '100%', textAlign: 'center' }}>{option.serialNo}</span>
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Select Assets" variant="outlined" />
                )}
                PaperComponent={({ children }) => (
                  <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', padding: '8px', borderBottom: '1px solid #ccc' }}>
                      <span style={{ width: '100%', textAlign: 'center' }}>AssetName</span>
                      <span style={{ width: '100%', textAlign: 'center' }}>Model</span>
                      <span style={{ width: '100%', textAlign: 'center' }}>SerialNo</span>
                    </div>
                    {children}
                  </div>
                )}
                value={addassets.find(asset => `${asset.assetName}-${asset.model}-${asset.serialNo}` === formData.name) || null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleSelectChange({ target: { name: "name", value: `${newValue.assetName}-${newValue.model}-${newValue.serialNo}` } });
                  }
                }}
              />
              {errors.name && (
                <Typography color="error">{errors.name}</Typography>
              )}
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} md={6}>
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
          </Grid> */}
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
