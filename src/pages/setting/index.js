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
import { Button, Modal } from '@mui/material'

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { subDays } from 'date-fns'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import toast from 'react-hot-toast'

const User = () => {
  // ** State
  const [startDateRange, setStartDateRange] = useState(null)
  const [endDateRange, setEndDateRange] = useState(null)

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = props.start !== null ? format(props.start, 'dd/MM/yyyy') : ''
    const endDate = props.end !== null ? ` - ${format(props.end, 'dd/MM/yyyy')}` : ''
    const value = `${startDate}${endDate}` || 'Please select start and end date'

    return <CustomTextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  const handleDelete = async () => {
    if (!startDateRange || !endDateRange) {
      toast.error('Please select start and end date')
    } else {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/dashboard/deleteScannedCodeByDate`, {
          startDate: startDateRange,
          endDate: endDateRange
        })
        .then(res => {
          console.log('user delete', res)
          setStartDateRange(null)
          setEndDateRange(null)
          toast.success('Data Detele Successfully')
        })
        .catch(e => {
          console.log('e', e)
          toast.error(e?.response?.data?.error?.message)
        })
    }
  }

  const downloadApplication = async () => {
    // const apkUrl = 'https://drive.google.com/uc?export=download&id=15uManNiZWw8wigdUaBFv7rT_HB8q7C9y'
    // const apkUrl = 'https://drive.google.com/uc?export=download&id=1g0qQdd0uBWEyux72e64SVKfzOCy3HpAp'
    // const link = document.createElement('a')
    // link.href = apkUrl
    // link.setAttribute('download', 'setuprinters.apk') // optional - sets the filename
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
    window.open('https://drive.google.com/uc?export=download&id=1g0qQdd0uBWEyux72e64SVKfzOCy3HpAp', '_blank')
    // toast.success('Application Download Successfully')
  }

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Select date for delete users data' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={5} xs={12}>
                <DatePicker
                  selectsRange
                  monthsShown={2}
                  endDate={endDateRange}
                  selected={startDateRange}
                  startDate={startDateRange}
                  shouldCloseOnSelect={false}
                  id='date-range-picker-months'
                  onChange={handleOnChangeRange}
                  popperPlacement={'bottom-start'}
                  customInput={<CustomInput label='' end={endDateRange} start={startDateRange} />}
                />
              </Grid>

              <Grid item sm={1.5} xs={12}>
                <Button variant='contained' startIcon={<Icon icon='tabler:trash' />} onClick={handleDelete}>
                  Delete
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Download Application' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid item sm={1.5} xs={12}>
                <Button variant='contained' startIcon={<Icon icon='tabler:download' />} onClick={downloadApplication}>
                  Download
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default User
