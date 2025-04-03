// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Custom Component Import
import { useDropzone } from 'react-dropzone'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Third Party Imports
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import toast from 'react-hot-toast'

// ** Actions Imports
// import { addUser } from 'src/store/apps/user'



const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))


const SidebarAddUser = props => {
  const [files, setFiles] = useState([])
  const [data, setData] = useState({})

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file)))

    }
  })

  const img = files.map(file => (
    <img key={file.name} alt={file.name} className='single-file-image' height={300} width={300} src={URL.createObjectURL(file)} />
  ))

  // ** Props
  const { open, toggle } = props

  // ** State
  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('subscriber')

  // ** Hooks
  // const dispatch = useDispatch()
  // const store = useSelector(state => state.user)

  const {
    reset,
    control,
    setValue,
    setError,
    formState: { errors }
  } = useForm({
    // defaultValues,
    // mode: 'onChange',
    // resolver: yupResolver(schema)
  })

  function jsonToFormData(json) {
    const formData = new FormData();

    Object.keys(json).forEach(key => {
        formData.append(key, json[key]);
    });

    return formData;
}

  const handleSubmit =async (e)  => {
    e.preventDefault()

    if(!data?.fullName){
toast.error("Full Name is requried")
    } else if(!data?.phoneNumber){
      toast.error("Phone Number is requried")
    }else if (!data?.phoneNumber2){
      toast.error("Phone Number is requried")
    }else if(!data?.email){
      toast.error("Email is requried")
    }else if (!data?.address){
      toast.error("Address is requried")
    }else{

  

    const formData = jsonToFormData({...data, profilePhoto : files?.[0]});

    await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/user/create`, formData).then(res => {
      console.log('res', res)
      toast.success("User Added Successfull")
      handleClose()
      props.getUser()
    }).catch(e => {
      console.log('e', e)
      toast.error(e?.response?.data?.error?.message)

    })

  }

  }

  const handelChange = (e) => {
    const {name, value} = e.target
    setData({...data, [name] : value})
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('subscriber')
    setValue('contact', Number(''))
    toggle()
    reset()
    setFiles([])
    setData()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h5'>Add User</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.16)`
            }
          }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit}>
          <Controller
            name='fullName'
            control={control}
            // rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                value={data?.fullName || ""}
                sx={{ mb: 4 }}
                label='Full Name'
                name="fullName"
                onChange={handelChange}
                placeholder=''
                error={Boolean(errors.fullName)}
                {...(errors.fullName && { helperText: errors.fullName.message })}
              />
            )}
          />
             <Controller
            name='contact'
            control={control}
            // rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='number'
                value={data?.phoneNumber || ""}
                sx={{ mb: 4 }}
                label='Mobile Number 1'
                name="phoneNumber"
                maxLength={10}
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    handelChange(e);
                  }
                }}
                placeholder=''
                error={Boolean(errors.contact)}
                {...(errors.contact && { helperText: errors.contact.message })}
              />
            )}
          />
             <Controller
            name='contact'
            control={control}
            // rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='number'
                value={data?.phoneNumber2 || ""}
                sx={{ mb: 4 }}
                label='Mobile Number 2'
                name="phoneNumber2"
                onChange={(e) => {
                  if (e.target.value.length <= 10) {
                    handelChange(e);
                  }
                }}
                placeholder=''
                error={Boolean(errors.contact)}
                {...(errors.contact && { helperText: errors.contact.message })}
              />
            )}
          />
          
          <Controller
            name='email'
            control={control}
            // rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                fullWidth
                type='email'
                label='Email'
                value={data?.email || ""}
                sx={{ mb: 4 }}
                name="email"
                onChange={handelChange}
                error={Boolean(errors.email)}
                placeholder=''
                {...(errors.email && { helperText: errors.email.message })}
              />
            )}
          />
       
     
       
       
       <CustomTextField
       fullWidth
       placeholder=""
        rows={4}
        multiline
        label='Address'
        name="address"
        value={data?.address || ""}
                onChange={handelChange}
        id='textarea-outlined-static'
      />

<Box border={"1px dotted #ccc"} borderRadius={1} mt={5} p={5}>
<Box {...getRootProps({ className: 'dropzone' })} sx={files.length ? { height: 300 } : {}}>
      <input {...getInputProps()} />
      {files.length ? (
        img
      ) : (
        <Box sx={{ display: 'flex', textAlign: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <Box
            sx={{
              mb: 4.75,
              width: 48,
              height: 48,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.08)`
            }}
          >
            <Icon icon='tabler:upload' fontSize='1.75rem' />
          </Box>
          <Typography variant='h6' sx={{ mb: 2.5 }}>
            Drop your profile photo here or click to upload your photo.
          </Typography>
          {/* <Typography sx={{ color: 'text.secondary', fontSize : 14 }}>
            (This is just a demo drop zone. Selected files are not actually uploaded.)
          </Typography> */}
        </Box>
      )}
    </Box>
</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt : 4 }}>
            <Button type='submit' variant='contained' sx={{ mr: 3 }}>
              Submit
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
