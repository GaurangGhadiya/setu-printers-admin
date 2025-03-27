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
import { subDays } from 'date-fns';

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

 


const User = () => {
  // ** State
  const [selectedImage, setSelectedImage] = useState(null);

  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(subDays(new Date(), 45))

  const handleClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };




  // ** Hooks
  // const dispatch = useDispatch()
  // const store = useSelector(state => state.user)
  // useEffect(() => {
  //   dispatch(
  //     fetchData({
  //       role,
  //       status,
  //       q: value,
  //       currentPlan: plan
  //     })
  //   )
  // }, [dispatch, plan, role, status, value])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const CustomInput = forwardRef((props, ref) => {

      const startDate = format(props.start, 'dd/MM/yyyy');
      const endDate = props.end !== null ? ` - ${format(props.end, 'dd/MM/yyyy')}` : '';
      const value = `${startDate}${endDate}`;
    
      return <CustomTextField fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />;
    

  });

  return (
    <Grid container spacing={6.5}>
    
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Select date for delete users' />
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
          popperPlacement={"bottom-start"}
          customInput={<CustomInput label='' end={endDateRange} start={startDateRange} />}
        />
              </Grid>
            
              <Grid item sm={1.5} xs={12}>
              <Button  variant='contained' startIcon={<Icon icon='tabler:trash' />}>
        Delete
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
