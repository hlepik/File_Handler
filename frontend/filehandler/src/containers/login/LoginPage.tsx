import { Fragment, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {Button, FormControl, Grid, Input, InputAdornment, InputLabel, styled, TextField} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AlertComponent, { EAlertClass } from "../../components/AlertComponent/AlertComponent";
import { Controller, useForm } from "react-hook-form";
import IconButton from "@mui/material/IconButton";
import {IdentityService} from "../../services/identity-service";
import {Navigate} from "react-router-dom";
import React from 'react';

const StyledGrid = styled(Grid)({
    marginBottom: "1rem",
    width: "100%",
});
const StyledForm = styled("form")({
    width: "100%",
});

interface ILoginInputs {
    email: string;
    password: string;
}
const LoginPage = () => {
    const appState = useContext(AppContext);
    const [loginData] = useState({ email: "", password: "", id: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const { handleSubmit, control, getFieldState, clearErrors, getValues } = useForm<ILoginInputs>({
        defaultValues: loginData,
    });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const loginClicked = async () => {
        let response = await IdentityService.Login("auth/login", getValues());
        if (response.ok) {
            setAlertMessage("");

            appState.setAuthInfo(
                response.data!.token,
                response.data!.firstname,
                response.data!.lastname,
                response.data!.id
            );
        } else {
            setAlertMessage("Wrong username or password!");

        }
    };
    useEffect(() => {}, []);

    return (
        <Fragment>
            {appState.token !== null ? <Navigate to="/" /> : null}

            <Grid container className="LoginContainer" data-testid={'login'}>
                <Grid className="LoginBox">
                    <StyledForm onSubmit={handleSubmit(loginClicked)}>
                        <AlertComponent
                            show={alertMessage !== ""}
                            message={alertMessage}
                            type={EAlertClass.Danger}
                        />

                        <StyledGrid>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, value, name }, fieldState: { error } }) => (
                                    <TextField
                                        error={!!error}
                                        fullWidth
                                        helperText={error ? error.message : null}
                                        label={"Email*"}
                                        value={value}
                                        variant="standard"
                                        onChange={(e) => {
                                            clearErrors(name);
                                            onChange(e);
                                        }}
                                    />
                                )}
                                rules={{
                                    required: "Enter your email!",
                                }}
                            />
                        </StyledGrid>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, value, name }, fieldState: { error, invalid } }) => (
                                <FormControl variant="standard" fullWidth >
                                    <InputLabel htmlFor="standard-adornment-password" id={"password"}>Password*</InputLabel>
                                    <Input
                                        inputProps={{ "data-testid": "passwordInput" }}
                                        aria-labelledby={"password"}
                                        error={!!error}
                                        type={showPassword ? "text" : "password"}
                                        value={value}
                                        onChange={(e) => {
                                            onChange(e);
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    data-testid="passwordButton"
                                                    onClick={handleClickShowPassword}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            )}
                            rules={{
                                required: "Enter your password!",
                            }}
                        />
                        {getFieldState("password").invalid ? (
                            <div className="ErrorMessage">{getFieldState("password").error!.message}</div>
                        ) : null}

                        <div className="loginButton">
                            <Button variant={"outlined"} type={"submit"} data-testid={"loginButton"} >Login</Button>
                        </div>
                    </StyledForm>
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default LoginPage;
