import { FC, ReactEventHandler, useEffect, useRef } from "react";
import {Button, Dialog, DialogContent,  Grid} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from 'react';


export interface IDialogScreen {
  isOpened: boolean;
  handleClose?: ReactEventHandler<{}>;

}

const DialogScreen: FC<IDialogScreen> = ({
  children,
  isOpened,
  handleClose
}) => {
  return (
    <Dialog
      aria-describedby="scroll-dialog-description"
      aria-labelledby="scroll-dialog-title"
      open={isOpened}
      data-testid={'dialog'}
      maxWidth={"md"}
    >
      <Grid className="StyledDialog">
        <Grid className="closeButton">
          <Button
            variant={"text"}
            data-testid={'closeButton'}
            onClick={handleClose}
            disableElevation
            disableFocusRipple
            disableRipple
          ><CloseIcon/></Button>
        </Grid>

        <DialogContent>{children}</DialogContent>
      </Grid>
    </Dialog>
  );
};

export default DialogScreen;
