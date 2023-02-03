import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import RegisterPage from "./RegisterPage";
import React from 'react';
//@ts-ignore
import replaceAllInserter from 'string.prototype.replaceall';
export {}

replaceAllInserter.shim();
describe('Register page component', ()=> {


    test('Should render register page component',  () => {
        render(
            <RegisterPage />
        );
        expect(screen.getByTestId("register")).toBeInTheDocument();

    })
    test('Should show an error message when firstname field is empty',  async () => {
        render(
            <RegisterPage />
        );
        const nameInput = screen.getByRole("textbox", {name: "First name*"});
        expect(nameInput).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("registerButton"));
        await waitFor(() => {
            expect(screen.getByText("First name must be 2-128 characters long!")).toBeInTheDocument();
        })
        const errorText = screen.getByText("First name must be 2-128 characters long!")
        fireEvent.change(nameInput,{target: {value: 'firstname'}} );
        await waitFor(() => {
            expect(errorText).not.toBeInTheDocument();
        })
    })
    test('Should show an error message when firstname field is blank',  async () => {
        render(
            <RegisterPage />
        );
        const nameInput = screen.getByRole("textbox", {name: "First name*"});
        expect(nameInput).toBeInTheDocument();
        fireEvent.change(nameInput,{target: {value: '      '}} );
        fireEvent.click(screen.getByTestId("registerButton"));
        await waitFor(() => {
            expect(screen.getByText("Enter your first name!")).toBeInTheDocument();
        })
    })
    test('Should show an error message when lastname field is blank',  async () => {
        render(
            <RegisterPage />
        );
        const lastnameInput = screen.getByRole("textbox", {name: "Last name*"});
        expect(lastnameInput).toBeInTheDocument();
        fireEvent.change(lastnameInput,{target: {value: '       '}} );
        fireEvent.click(screen.getByTestId("registerButton"));
        await waitFor(() => {
            expect(screen.getByText("Enter your last name!")).toBeInTheDocument();
        })
    })
    test('Should show an error message when passwords do not match',  async () => {
        render(
            <RegisterPage />
        );
        const passwordInput = screen.getByTestId("passwordInput");
        const confirmPasswordInput = screen.getByTestId("confirm-passwordInput");
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        fireEvent.change(passwordInput,{target: {value: 'password'}} );
        fireEvent.change(confirmPasswordInput,{target: {value: 'password1'}} );
        fireEvent.click(screen.getByTestId("registerButton"));
        await waitFor(() => {
            expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
        })
    })
    test('Should show password and hide it after click',  async() => {
        render(
            <RegisterPage />
        );
        const passwordInput = screen.getByTestId("passwordInput");
        const passwordButton = screen.getByTestId("passwordButton");
        fireEvent.change(passwordInput,{target: {value: 'password'}} );
        expect(passwordInput).toHaveAttribute('type', 'password');
        fireEvent.click(passwordButton);
        await waitFor(() => {
            expect(passwordInput).toHaveAttribute('type', 'text');
        })
    })
    test('Should check if email is in correct format',  async() => {
        render(
            <RegisterPage />
        );
        const email = screen.getByRole("textbox", {name: "Email*"});
        expect(email).toBeInTheDocument();
        fireEvent.change(email,{target: {value: 'test.com'}} );
        fireEvent.click(screen.getByTestId("registerButton"));
        await waitFor(() => {
            expect(screen.getByText("The email is incorrect")).toBeInTheDocument();
        })
    })
    test('Should show an error message when firstname field is too long or too short',  async () => {
        render(
            <RegisterPage />
        );
        const nameInput = screen.getByRole("textbox", {name: "First name*"});
        expect(nameInput).toBeInTheDocument();
        fireEvent.change(nameInput,{target: {value: 'e'}} );
        fireEvent.click(screen.getByTestId("registerButton"));
        await waitFor(() => {
            expect(screen.getByText("First name must be 2-128 characters long!")).toBeInTheDocument();
        })
    })
    test('Should show an error message when lastname field is too long or too short',  async () => {
        render(
            <RegisterPage />
        );
        const nameInput = screen.getByRole("textbox", {name: "Last name*"});
        expect(nameInput).toBeInTheDocument();
        fireEvent.change(nameInput,{target: {value: 'e'}} );
        fireEvent.click(screen.getByTestId("registerButton"));
        await waitFor(() => {
            expect(screen.getByText("Last name must be 2-128 characters long!")).toBeInTheDocument();
        })
    })

})