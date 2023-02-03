import { Fragment, useContext, useEffect, useState } from "react";
import React from 'react';
import { AppContext } from "../../context/AppContext";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  styled,
  TextField,
} from "@mui/material";
import { Navigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import { isBlank } from "../../utils/isBlank";
import { EMAIL_REGEX } from "../../utils/regex";

import AlertComponent, { EAlertClass } from "../../components/AlertComponent/AlertComponent";
import {IdentityService} from "../../services/identity-service";

const StyledForm = styled("form")({
  width: "100%",
});
const StyledGrid = styled(Grid)({
  marginBottom: "1rem",
  width: "100%",
});

interface IFormValues {
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

const RegisterPage = () => {
  const appState = useContext(AppContext);
  const [hasError, setHasError] = useState(false);

  const [registerData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    handleSubmit,
    control,
    getFieldState,
    setError,
    clearErrors,
    getValues,
  } = useForm<IFormValues>({ defaultValues: registerData });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };


  const registerClicked = async (data: IFormValues) => {
    setAlertMessage("");
    setHasError(false);
    if (isBlank(data.firstname)) {
      setError("firstname", {
        type: "manual",
        message: "Enter your first name!",
      });
      setHasError(true);
    }
    if (data.firstname.length < 2 || data.firstname.length > 128) {
      setError("firstname", {
        type: "manual",
        message: "First name must be 2-128 characters long!",
      });
      setHasError(true);
    }
    if (isBlank(data.lastname)) {
      setError("lastname", {
        type: "manual",
        message: "Enter your last name!",
      });
      setHasError(true);
    }
    if (data.lastname.length < 2 || data.lastname.length > 128) {
      setError("lastname", {
        type: "manual",
        message: "Last name must be 2-128 characters long!",
      });
      setHasError(true);
    }
    if (isBlank(data.email)) {
      setError("email", {
        type: "manual",
        message: "Enter your email!",
      });
      setHasError(true);
    }
    if (!data.email.match(EMAIL_REGEX)) {
      setError("email", {
        type: "manual",
        message: "The email is incorrect",
      });
      setHasError(true);
    }
    if (data.email.length < 6 || data.email.length > 128) {
      setError("email", {
        type: "manual",
        message: "Email must be 6-128 characters long",
      });
      setHasError(true);
    }
    if (isBlank(data.password)) {
      setError("password", {
        type: "manual",
        message: "Enter your password.",
      });
      setHasError(true);
    }
    if (data.password.length < 6 || data.password.length > 128) {
      setAlertMessage( "Password must be 6 - 128 characters long!");
      return;
    }
    if (data.password !== confirmPassword) {
      setAlertMessage("Passwords do not match.")
      return;
    }
    if(hasError){
      return;
    }


    let response = await IdentityService.register(
      "auth/register",
      getValues()
    );

    if (!response.ok) {

      if (response.statusCode === 400) {
        setError("email", {
          type: "manual",
          message: response.message,
        });
        return;
      }
    } else {
      setAlertMessage("");
      appState.setAuthInfo(
        response.data!.token,
        response.data!.firstname,
        response.data!.lastname,
        response.data!.id
      );
    }
  };

  useEffect(() => {}, []);

  return (
    <Fragment>
      {appState.token !== null ? <Navigate to="/" /> : null}
      <Grid container className="LoginContainer" data-testid={"register"}>
        <Grid className="LoginBox">
          <StyledForm onSubmit={handleSubmit(registerClicked)}>
            <AlertComponent
              show={alertMessage !== ""}
              message={alertMessage}
              type={EAlertClass.Danger}
            />

            <StyledGrid>
              <Controller
                control={control}
                name="firstname"
                render={({
                  field: { onChange, value, name },
                  fieldState: { error },
                }) => (
                  <TextField
                    error={!!error}
                    fullWidth
                    helperText={error ? error.message : null}
                    label={"First name*"}
                    value={value}
                    variant="standard"
                    onChange={(e) => {
                      clearErrors(name);
                      onChange(e);
                    }}
                  />
                )}
              />
            </StyledGrid>
            <StyledGrid>
              <Controller
                control={control}
                name="lastname"
                render={({
                  field: { onChange, value, name },
                  fieldState: { error },
                }) => (
                  <TextField
                    error={!!error}
                    fullWidth
                    helperText={error ? error.message : null}
                    label={"Last name*"}
                    value={value}
                    variant="standard"
                    onChange={(e) => {
                      clearErrors(name);
                      onChange(e);
                    }}
                  />
                )}
              />
            </StyledGrid>
            <StyledGrid>
              <Controller
                control={control}
                name="email"
                render={({
                  field: { onChange, value, name },
                  fieldState: { error },
                }) => (
                  <TextField
                    error={!!error}
                    fullWidth
                    helperText={error ? error.message : null}
                    label={"Email*"}
                    value={value}
                    autoComplete="off"
                    variant="standard"
                    onChange={(e) => {
                      clearErrors(name);
                      onChange(e);
                    }}
                  />
                )}
              />
            </StyledGrid>
            <StyledGrid>
              <Controller
                control={control}
                name="password"
                render={({
                  field: { onChange, value, name },
                  fieldState: { error, invalid },
                }) => (
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="standard-adornment-password">
                      Password*
                    </InputLabel>
                    <Input
                        inputProps={{ "data-testid": "passwordInput" }}
                        error={!!error}
                      type={showPassword ? "text" : "password"}
                      value={value}
                      autoComplete="new-password "
                      onChange={(e) => {
                        onChange(e);
                      }}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            data-testid="passwordButton"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                )}
              />

              {getFieldState("password").invalid ? (
                <div className="ErrorMessage">
                  {getFieldState("password").error!.message}
                </div>
              ) : null}
            </StyledGrid>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="standard-adornment-password">
                Confirm password*
              </InputLabel>
              <Input
                type={showPassword ? "text" : "password"}
                inputProps={{ "data-testid": "confirm-passwordInput" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>

            {getFieldState("password").invalid ? (
              <div className="ErrorMessage">
                {getFieldState("password").error!.message}
              </div>
            ) : null}
            <Grid className="loginButton">
              <Button
                variant={"outlined"}
                type={"submit"}
                data-testid={'registerButton'}
              >Register</Button>
            </Grid>
          </StyledForm>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default RegisterPage;
