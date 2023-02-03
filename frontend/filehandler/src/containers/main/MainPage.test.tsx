import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import MainPage from "./MainPage";
import React, {  useState} from 'react';
import {AppContextProvider} from "../../context/AppContext";
import {IFile} from "../../dto/IFile";
import {EAlertClass} from "../../components/AlertComponent/AlertComponent";


export {}

describe('Main page component', ()=> {

    const fileValues = [{ name: 'Test file' }];
    const appState = {token: 'test-token', firstname: 'John', lastname: 'Doe', id: '123', setAuthInfo: (token: string | null, firstname: string, lastname: string, id: string): void => { }};
    test('Should render main page component',  () => {

        render(
            <MainPage />
        );
        expect(screen.getByTestId("mainPage")).toBeInTheDocument();
    })
    test('Should allow to insert a file and return error after upload.',  async () => {
        render(
            <AppContextProvider value={appState}>
                <MainPage/>
            </AppContextProvider>
        );

        const str = JSON.stringify(fileValues);
        const blob = new Blob([str]);
        const file = new File([blob], 'TestFile.json', {
            type: 'application/JSON',
        });
        File.prototype.text = jest.fn().mockResolvedValueOnce(str);
        const addButton = screen.getByRole("button", {name: "Add file"});
        fireEvent.click(addButton);
        await waitFor(() => {
            expect(screen.getByText("Drag and drop a file here or click")).toBeInTheDocument();
        })

        fireEvent.drop(screen.getByText("Drag and drop a file here or click"), file);
        const submitButton = screen.getByRole("button", {name: "Submit"});
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(screen.getByText("File upload failed!")).toBeInTheDocument();
        })


    })
    test('should render a data',  async () => {
        const files: IFile[] = [{name: "Test.pdf", type: "application/pdf", id: "123", data: ""}]
        jest
            .spyOn(React, 'useState')
            .mockImplementationOnce(() => [files, () => null])
            .mockImplementationOnce(() => [{message: "", type: EAlertClass.Danger}, () => null]);
        render(
            <AppContextProvider value={appState}>
                <MainPage/>
            </AppContextProvider>
        );
        expect(screen.getByText("Test.pdf")).toBeInTheDocument();
        const deleteButton = screen.getByTestId("deleteButton");
        expect(deleteButton).toBeInTheDocument();

    })
})
