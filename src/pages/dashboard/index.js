// ** React Imports
import { useState, useEffect, useCallback, forwardRef } from 'react'

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

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { subDays } from 'date-fns'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import moment from 'moment'
import toast from 'react-hot-toast'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import AlertDialogSlide from '../setting/DeleteDilog'

const exportToExcel = (data, fileName = 'data.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data) // Convert JSON to sheet
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })

  const excelBlob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })

  saveAs(excelBlob, fileName) // Download file
  toast.success('CSV download successfull')
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

const User = () => {
  // ** State
  const [selectedImage, setSelectedImage] = useState(null)

  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [startDateRangeCSV, setStartDateRangeCSV] = useState(null)
  const [endDateRangeCSV, setEndDateRangeCSV] = useState(null)
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(new Date())
  const [searchName, setSearchName] = useState('')
  const [userList, setUserList] = useState([])
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const handleCloseDelete = () => {
    setOpen(false)
  }

  const handleSave = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/dashboard/deleteScannedCode/${deleteId}`, {})
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

  const exportAsCsv = () => {
    let exportData = [...userList]

    if (startDateRangeCSV && endDateRangeCSV) {
      const startDate = new Date(startDateRangeCSV)
      const endDate = new Date(endDateRangeCSV)

      const filteredUsers = userList.filter(user => {
        const createdAt = new Date(user.created_at)

        return createdAt >= startDate && createdAt <= endDate
      })
      exportData = [...filteredUsers]

      console.log('filteredUsers', filteredUsers)
    }

    let finalData = exportData?.map(user => ({
      Name: user?.user_data?.full_name,
      Barcode: user?.barcode,
      Selfie: process.env.NEXT_PUBLIC_PHOTO_BASE_URL + '/' + user.selfie,
      CreatedDate: moment(user.created_at).format('DD-MM-YYYY hh:mm A')
    }))

    console.log('finalData', finalData)
    if (finalData?.length > 0) {
      exportToExcel(finalData)
    } else {
      toast.error('No data found between selected dates')
    }
  }

  const getUser = async (e, clear) => {
    console.log('clear', clear)
    if (clear == true) {
      setSearchName('')
      setStartDateRange(null)
      setEndDateRange(null)
    }

    let body = {
      searchName,
      startDate: startDateRange,
      endDate: endDateRange
    }
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/dashboard/list`, clear ? {} : body)
      .then(res => {
        console.log('userList', res)
        setUserList(res?.data?.data)
      })
      .catch(e => {
        console.log('e', e)
        toast.error(e?.response?.data?.error?.message)
      })
  }

  useEffect(() => {
    getUser()
  }, [])

  const handleClick = imageUrl => {
    setSelectedImage(imageUrl)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

  const handleDelete = async id => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/dashboard/deleteScannedCode/${id}`, {})
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

  const columns = [
    {
      flex: 0.2,
      minWidth: 100,
      field: 'fullName',
      headerName: 'Thumbnail',
      sortable: false,
      renderCell: ({ row }) => {
        const { fullName, email } = row

        return <Box sx={{ display: 'flex', alignItems: 'center' }}>{renderClient(row)}</Box>
      }
    },
    {
      flex: 0.25,
      field: 'name',
      minWidth: 270,
      headerName: 'Name',
      sortable: false,

      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.user_data?.full_name}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      field: 'email',
      minWidth: 270,
      headerName: 'QR Code Value',
      sortable: false,

      renderCell: ({ row }) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
              {row?.barcode}
            </Typography>
          </Box>
        )
      }
    },
    {
      flex: 0.25,
      minWidth: 200,
      headerName: 'Date Time',
      sortable: false,

      field: 'Date Time',
      renderCell: ({ row }) => {
        return (
          <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
            {moment(row?.created_at).format('DD-MM-YYYY hh:mm A ')}
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
              setDeleteId(row?.id)
            }}
          >
            <Icon icon='tabler:trash' fontSize={20} color='red' />
            &nbsp;
          </Box>
        )
      }

      // <RowOptions id={row.id} />
    }
  ]

  const renderClient = row => {
    if (row?.selfie) {
      return (
        <CustomAvatar
          onClick={() =>
            row?.selfie
              ? handleClick(process.env.NEXT_PUBLIC_PHOTO_BASE_URL + '/' + row?.selfie)
              : toast.error('No image found')
          }
          src={process.env.NEXT_PUBLIC_PHOTO_BASE_URL + '/' + row?.selfie}
          sx={{ mr: 2.5, width: 38, height: 38, cursor: 'pointer' }}
        />
      )
    }
  }

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleOnChangeRangeCSV = dates => {
    const [start, end] = dates
    setStartDateRangeCSV(start)
    setEndDateRangeCSV(end)
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = props.start !== null ? format(props.start, 'dd/MM/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'dd/MM/yyyy')}` : ''
    const value = `${startDate}${endDate}` || 'Select start and end date'

    return <CustomTextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  })
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          {/* <CardHeader title='Search Filters' /> */}
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={2} xs={12}>
                <CustomTextField
                  fullWidth
                  sx={{ mr: 4 }}
                  value={searchName || ''}
                  placeholder='Search By User'
                  onChange={e => setSearchName(e.target.value)}
                />
              </Grid>
              <Grid item sm={2.5} xs={12}>
                <DatePicker
                  selectsRange
                  monthsShown={2}
                  endDate={endDateRange}
                  selected={startDateRange}
                  startDate={startDateRange}
                  id='date-range-picker-months'
                  onChange={handleOnChangeRange}
                  popperPlacement={'bottom-start'}
                  customInput={<CustomInput label='' end={endDateRange} start={startDateRange} />}
                />
              </Grid>

              <Grid item sm={1.5} xs={12}>
                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={<Icon icon='tabler:x' />}
                  onClick={e => getUser(e, true)}
                >
                  Clear
                </Button>
              </Grid>
              <Grid item sm={1.5} xs={12}>
                <Button variant='contained' fullWidth startIcon={<Icon icon='tabler:search' />} onClick={getUser}>
                  Search
                </Button>
              </Grid>
              <Grid item sm={2.5} xs={12}>
                <DatePicker
                  selectsRange
                  monthsShown={2}
                  endDate={endDateRangeCSV}
                  selected={startDateRangeCSV}
                  startDate={startDateRangeCSV}
                  id='date-range-picker-months'
                  onChange={handleOnChangeRangeCSV}
                  popperPlacement={'bottom-start'}
                  customInput={<CustomInput label='' end={endDateRangeCSV} start={startDateRangeCSV} />}
                />
              </Grid>
              <Grid item sm={2} xs={12}>
                <Button variant='contained' startIcon={<Icon icon='tabler:download' />} onClick={exportAsCsv}>
                  Export as CSV
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
          {/* <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} /> */}
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={userList}
            columns={columns}
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableSelectionOnClick
            disableDensitySelector
            disableRowSelectionOnClick
            sortingMode='none'
            pagination={false} // Disables pagination
            hideFooterPagination // Disables pagination
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
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
        message={'Are you sure you want to delete this data?'}
      />
    </Grid>
  )
}

export default User
