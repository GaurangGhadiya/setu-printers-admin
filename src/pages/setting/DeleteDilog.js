import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />
})

export default function AlertDialogSlide({ open, handleClose, handleSave, message }) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>{message}</DialogTitle>
        <DialogActions style={{ marginTop: '20px' }}>
          <Button onClick={handleClose} style={{ color: 'red' }}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Submit</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
