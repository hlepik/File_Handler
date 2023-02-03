import {render, screen, fireEvent} from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import DialogScreen from "./DialogScreen";
import {FC, ReactEventHandler, useEffect,useState} from "react";
import React from 'react';

export {}


describe('DialogScreen component', ()=> {


    test('Should displays the dialog screen and closes after pressing the close button', async () => {
        const handleClose = jest.fn();
        render(
            <Wrapper handleClose={handleClose}/>,
        );
        const dialog = screen.getByTestId('dialog');
        expect(dialog).toBeInTheDocument();
        const closeButton = screen.getByTestId('CloseIcon')
        fireEvent.click(closeButton)
        expect(handleClose).toHaveBeenCalledTimes(1);

    })
})

export interface IDialogScreen {
    handleClose?: ReactEventHandler<{}>;

}

const Wrapper: FC<IDialogScreen> = ({
     handleClose
 }) => {
    const [isDialogOpened, setIsDialogOpened] = useState(true)

    useEffect(() => {
       if(handleClose){
           setIsDialogOpened(!isDialogOpened);
       }
    }, []);


    return <DialogScreen isOpened={isDialogOpened} handleClose={handleClose}/>
}

export default DialogScreen;