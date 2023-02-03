import AlertComponent, {EAlertClass} from "./AlertComponent";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import React from 'react';

export {}

const message = "Alert message";

describe('AlertComponent', ()=> {


    test('Should displays an error message', ()=> {
        render(
            <AlertComponent show={true} message={message} type={EAlertClass.Danger}/>,
        );
        expect(screen.getByText(message)).toBeInTheDocument();

        expect(screen.getByRole('alert')).toHaveStyle(`color: rgb(95, 33, 32); background-color: rgb(253, 237, 237)`);
        expect(screen.getByText(message)).toBeInTheDocument();
    })

    test('Should not displays an error message', ()=> {
        render(
            <AlertComponent show={false} message={message} type={EAlertClass.Danger}/>,
        );
        const alertMessage = screen.queryByText(message);
        expect(alertMessage).not.toBeInTheDocument();

    })
})


