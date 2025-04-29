// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { IconButton, InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [showPassword3, setShowPassword3] = useState(false)
  const [formData, setFormData] = useState({})

  console.log('formData', formData)

  useEffect(() => {
    if (localStorage.getItem('userData')) {
      let email = JSON.parse(localStorage.getItem('userData'))?.email
      setFormData({ ...formData, email: email })
    }
  }, [router])

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async () => {
    // if (!formData.email) {
    //   toast.error('email is requried')

    // } else if (!formData.oldPassword) {
    //   toast.error('Old password is requried')
    // }

    if (!formData.newPassword) {
      toast.error('New password is requried')
    } else if (!formData.newPassword2) {
      toast.error('Confirm password is requried')
    } else if (formData.newPassword != formData.newPassword2) {
      toast.error('New password and Confirm Password is not match')
    } else {
      await axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/admin/auth/forgotPassword`, {
          email: formData.email,

          // oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        })
        .then(res => {
          console.log('user login', res)
          toast.success('Password Change Successfully')
          router.push('/setting')
        })
        .catch(e => {
          console.log('e', e)
          toast.error(e?.response?.data?.error?.message)
        })
    }
  }

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <svg width={34} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
              />
              <path
                fill='#161616'
                opacity={0.06}
                fillRule='evenodd'
                clipRule='evenodd'
                d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
              />
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                fill={theme.palette.primary.main}
                d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
              />
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                Change Password? 🔒
              </Typography>
              {/* <Typography sx={{ color: 'text.secondary' }}>
                Enter your email and we&prime;ll send you instructions to reset your password
              </Typography> */}
            </Box>
            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
              {/*<CustomTextField
                fullWidth
                autoFocus
                type={'email'}
                label='Email'
                sx={{ display: 'flex', mb: 4 }}
                onChange={handleChange}
                name='email' // ← add this line
                value={formData?.email || ''}
              /> */}
              {/* <CustomTextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                label='Old Password'
                sx={{ display: 'flex', mb: 4 }}
                onChange={handleChange}
                name='oldPassword' // ← add this line
                value={formData?.oldPassword || ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              /> */}
              <CustomTextField
                fullWidth
                type={showPassword2 ? 'text' : 'password'}
                label='New Password'
                sx={{ display: 'flex', mb: 4 }}
                onChange={handleChange}
                name='newPassword' // ← add this line
                value={formData?.newPassword || ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword2(!showPassword2)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword2 ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <CustomTextField
                fullWidth
                type={showPassword3 ? 'text' : 'password'}
                label='Confirm Password'
                sx={{ display: 'flex', mb: 4 }}
                onChange={handleChange}
                name='newPassword2' // ← add this line
                value={formData?.newPassword2 || ''}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => setShowPassword3(!showPassword3)}
                      >
                        <Icon fontSize='1.25rem' icon={showPassword3 ? 'tabler:eye' : 'tabler:eye-off'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <Button fullWidth type='button' onClick={handleSubmit} variant='contained' sx={{ mb: 4 }}>
                Change Password
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/setting'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Cancel</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>

// ForgotPassword.guestGuard = true

export default ForgotPassword
