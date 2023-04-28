import React from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
const ModalPop = ({open,handleClose,title,handleOkay,data}) => {
  return (
    <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    style={{ backgroundColor: "rgba(255,0,0,0,0.2)" }}
  >
    <DialogTitle id="alert-dialog-title">
      {title}
    </DialogTitle>

    <DialogActions>
      <Button onClick={handleClose}>No</Button>
      <Button onClick={()=>handleOkay(data)} >
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  )
}

export default ModalPop