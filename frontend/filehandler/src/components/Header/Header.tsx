import { AppContext } from "../../context/AppContext";
import { Fragment, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button,  Grid, styled } from "@mui/material";
import React from 'react';

const LinkGrid = styled(Grid)({
    display: "flex",
    flexDirection: "row",
    marginTop: "1.5rem",
    width: "100%",
    justifyContent: "right",
});
const StyledButtons = styled("div")({
    display: "flex",
    columnGap: "0.5rem"
});

const Header = () => {
    const appState = useContext(AppContext);
    const navigate = useNavigate();

    const loadData = useCallback(async () => {
        let data = window.localStorage.getItem("state");
        window.localStorage.clear();
        if (data !== null) {
            let state = JSON.parse(data);
            appState.setAuthInfo(state.token, state.firstname, state.lastname, state.id);
        }
    }, [appState]);

    useEffect(() => {
        loadData();
        window.onbeforeunload = function () {
            window.localStorage.setItem("state", JSON.stringify(appState));
            return true;
        };
        return () => {
            window.onbeforeunload = null;
        };
    }, [loadData]);


    return (
            <div id="header" data-testid={"header"}>
                <Grid className="HeaderLinks">
                    <LinkGrid>
                        {appState.token != null ? (
                            <>
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        navigate("/#");
                                        appState.setAuthInfo(null, "", "", "");
                                    }}
                                >Log out</Button>
                            </>
                        ) : (
                            <StyledButtons>
                                <Button
                                    variant="text"
                                    onClick={() => navigate("/login")}
                                >Sign in</Button>
                                <Button
                                    variant="text"
                                    onClick={() => navigate("/register")}
                                >Create account</Button>
                            </StyledButtons>
                        )}
                    </LinkGrid>
                </Grid>
            </div>
    );
};

export default Header;
