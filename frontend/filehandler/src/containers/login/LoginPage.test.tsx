import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import LoginPage from "./LoginPage";
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
export {}

describe('Login page component', ()=> {


    test('Should render login page component',  () => {
        render(
            <LoginPage />
        );
        expect(screen.getByTestId("login")).toBeInTheDocument();

    })
    test('Should show password and hide it after click',  async() => {
        render(
            <LoginPage />
        );
        const passwordInput = screen.getByTestId("passwordInput");
        expect(passwordInput).toBeInTheDocument();
        fireEvent.change(passwordInput,{target: {value: 'password'}} );
        expect(passwordInput).toHaveValue("password");
        const passwordText = screen.queryByText("password");
        expect(passwordText).not.toBeInTheDocument();
        const passwordButton = screen.getByTestId("passwordButton");
        expect(passwordInput).toHaveAttribute('type', 'password');
        fireEvent.click(passwordButton);
        await waitFor(() => {
            expect(passwordInput).toHaveAttribute('type', 'text');
        })

    })
    test('Should allow insert email',  async() => {
        render(
            <LoginPage />
        );
        const emailInput = screen.getByRole("textbox", {name: "Email*"});
        expect(emailInput).toBeInTheDocument();
        fireEvent.change(emailInput,{target: {value: 'test@email.com'}} );
        expect(emailInput).toHaveValue('test@email.com');
    })
    test('Should show an error after login clicked',  async() => {
        render(
            <LoginPage />
        );
        const emailInput = screen.getByRole("textbox", {name: "Email*"});
        fireEvent.change(emailInput,{target: {value: 'test@email.com'}} );
        const passwordInput = screen.getByTestId("passwordInput");
        fireEvent.change(passwordInput,{target: {value: 'password'}} );
        const loginButton = screen.getByRole("button", {name: "Login"});
        fireEvent.click(loginButton);
        await waitFor(() => {
            expect(screen.getByText("Wrong username or password!")).toBeInTheDocument();
        })

    })
})