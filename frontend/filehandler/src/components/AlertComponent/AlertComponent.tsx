import Alert from "@mui/material/Alert";
import { FC } from "react";
import { Grid } from "@mui/material";
import React from 'react';

export enum EAlertClass {
  Success = "success",
  Danger = "error",
  Warning = "warning",
  Info = "info",
}
interface ErrorValues {
  message: string;
  show: boolean;
  type: EAlertClass;
}

const AlertComponent: FC<ErrorValues> = ({
  message,
  show,
  type
}) => {
  return show ? (
    <Grid className={"DialogAlert"}>
      <Alert severity={type}>
        {message}
      </Alert>
    </Grid>
  ) : null;
};

export default AlertComponent;
