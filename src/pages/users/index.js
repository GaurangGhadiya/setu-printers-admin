// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomTextField from 'src/@core/components/mui/text-field'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
// import { fetchData, deleteUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from './TableHeader'
import AddUserDrawer from './AddUserDrawer'
import { Button, Modal } from '@mui/material'
import toast from 'react-hot-toast'
import AlertDialogSlide from '../setting/DeleteDilog'

// ** renders client column
const userRoleObj = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  author: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  subscriber: { icon: 'tabler:user', color: 'warning' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

// ** renders client column

const RowOptions = ({ id }) => {
  // ** Hooks
  // const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    // dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleRowOptionsClose}>
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const Home = () => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [userList, setUserList] = useState([])
  const [filterData, setFilterData] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const handleCloseDelete = () => {
    setOpen(false)
  }
  const handleSave = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/user/delete/${deleteId}`, {})
      .then(res => {
        console.log('user delete', res)
        toast.success('User Delete Successfully')
        getUser()
        setDeleteId(null)
        setOpen(false)
      })
      .catch(e => {
        console.log('e', e)
        toast.error(e?.response?.data?.error?.message)
      })
  }

  console.log('filterData', filterData)

  const handleClick = imageUrl => {
    setSelectedImage(imageUrl)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

  const renderClient = row => {
    if (row?.profile_photo) {
      return (
        <CustomAvatar
          onClick={() =>
            row?.profile_photo != 'null'
              ? handleClick(process.env.NEXT_PUBLIC_PHOTO_BASE_URL + '/' + row?.profile_photo)
              : toast.error('No image found')
          }
          src={process.env.NEXT_PUBLIC_PHOTO_BASE_URL + '/' + row?.profile_photo}
          sx={{ mr: 2.5, width: 38, height: 38, cursor: 'pointer' }}
        />
      )
    }
  }

  const getUser = async clear => {
    console.log('clear', clear)
    if (clear) {
      setFilterData({})
    }
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/user/list`, clear ? {} : filterData)
      .then(res => {
        console.log('userList', res)
        setUserList(res?.data?.data)
      })
      .catch(e => {
        console.log('e', e)
        toast.error(e?.response?.data?.error?.message)
      })
  }

  const handleDelete = async id => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/user/delete/${id}`, {})
      .then(res => {
        console.log('user delete', res)
        toast.success('User Delete Successfully')
        getUser()
      })
      .catch(e => {
        console.log('e', e)
        toast.error(e?.response?.data?.error?.message)
      })
  }

  useEffect(() => {
    getUser()
  }, [])

  const columns = [
    {
      flex: 0.2,
      minWidth: 200,
      field: 'fullName',
      headerName: 'User',
      sortable: false,
      renderCell: ({ row }) => {
        const { full_name, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {renderClient(row)}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  textDecoration: 'capitalize',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {full_name}
              </Typography>
              {/* <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography> */}
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'email',
      minWidth: 270,
      headerName: 'Email',
      sortable: false,

      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* <CustomAvatar
              skin='light'
              sx={{ mr: 4, width: 30, height: 30 }}
              color={userRoleObj[row.role].color || 'primary'}
            >
              <Icon icon={userRoleObj[row.role].icon} />
            </CustomAvatar> */}
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'lowercase' }}>
              {row?.email || '-'}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 120,
      headerName: 'Phone Number',
      sortable: false,

      field: 'Phone Number',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {row?.phone_number}
          </Typography>
        )
      }
    },
    {
      flex: 0.2,
      minWidth: 190,
      field: 'company',
      sortable: false,

      headerName: 'Phone Number 2',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ color: 'text.secondary' }}>
            {row?.phone_number_2 || '-'}
          </Typography>
        )
      }
    },

    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => {
        return (
          <Box
            display={'flex'}
            alignItems={'center'}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setOpen(true)
              setDeleteId(row?.user_id)
            }}
          >
            <Icon icon='tabler:trash' fontSize={20} color='red' />
            &nbsp;
          </Box>
        )
      }
    }
  ]

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      {/* <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData?.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid> */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={3} xs={12}>
                <CustomTextField
                  fullWidth
                  name='name'
                  value={filterData?.searchName || ''}
                  sx={{ mr: 4 }}
                  placeholder='Search By Name'
                  onChange={e => setFilterData({ ...filterData, searchName: e.target.value })}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <CustomTextField
                  fullWidth
                  name='=email'
                  value={filterData?.email || ''}
                  sx={{ mr: 4 }}
                  placeholder='Search By Email'
                  onChange={e => setFilterData({ ...filterData, email: e.target.value })}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <CustomTextField
                  fullWidth
                  name='phone'
                  type='number'
                  value={filterData?.phoneNumber || ''}
                  sx={{ mr: 4 }}
                  placeholder='Search By Phone Number'
                  onChange={e => setFilterData({ ...filterData, phoneNumber: e.target.value })}
                />
              </Grid>
              <Grid item sm={1.5} xs={12}>
                <Button variant='outlined' fullWidth startIcon={<Icon icon='tabler:x' />} onClick={e => getUser(true)}>
                  Clear
                </Button>
              </Grid>
              <Grid item sm={1.5} xs={12}>
                <Button
                  variant='contained'
                  fullWidth
                  startIcon={<Icon icon='tabler:search' />}
                  onClick={() => getUser()}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={userList}
            columns={columns}
            getRowId={row => row.user_id} // Use user_id as the unique id
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableSelectionOnClick
            disableDensitySelector
            disableRowSelectionOnClick
            sortingMode='none'
            pagination={false} // Disables pagination
            hideFooterPagination

            // pageSizeOptions={[10, 25, 50]}
            // paginationModel={paginationModel}
            // onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} getUser={getUser} />
      <Modal open={!!selectedImage} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'white',
            boxShadow: 24,
            p: 2,
            outline: 'none',
            borderRadius: 2
          }}
        >
          {selectedImage && <img src={selectedImage} alt='Preview' width='300' />}
        </Box>
      </Modal>
      <AlertDialogSlide
        open={open}
        handleClose={handleCloseDelete}
        handleSave={handleSave}
        message={'Are you sure you want to delete this user?'}
      />
    </Grid>
  )
}

export default Home
