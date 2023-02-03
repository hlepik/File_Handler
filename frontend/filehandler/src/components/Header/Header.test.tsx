import Header from "./Header";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import {BrowserRouter} from "react-router-dom";

export {}
describe('Header component', ()=> {


    test('Should render header component',  () => {
        render(
            <BrowserRouter>
                <Header />,
            </BrowserRouter>
        );

        expect(screen.getByTestId("header")).toBeInTheDocument();

    })
})