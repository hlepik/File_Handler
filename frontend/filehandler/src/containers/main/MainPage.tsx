import {
    Button, Dialog,
    DialogActions, DialogContent,
    Grid,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import {useCallback, useContext, useEffect, useState} from "react";
import {IFile} from "../../dto/IFile";
import FileSaver from "file-saver";
import {AppContext} from "../../context/AppContext";
import {useForm} from "react-hook-form";
import {FormDataService} from "../../services/FormDataService";
import {ApiBaseUrl} from "../../configuration";
import AlertComponent, {EAlertClass} from "../../components/AlertComponent/AlertComponent";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import {BaseService} from "../../services/base-service";
import DialogScreen from "../../components/DialogScreen/DialogScreen";
import React from 'react';
import {DropzoneArea} from "react-mui-dropzone";


export interface IFileForm {
    id: string;
    name: string;
    type: string;
    data: string;
}
export interface IAlertMessage {
    type?: EAlertClass;
    message: string;
}
const DropZoneContainer = styled("div")  ({
    "& .MuiSnackbar-root": {
        whiteSpace: "pre",
    },
    "& .MuiDropzonePreviewList-imageContainer": {
        paddingTop: "18px !important",
    },
    "& .MuiDropzonePreviewList-root": {
        marginTop: "0px !important",
    },
    "& .MuiDropzoneArea-root": {
        border: "solid 1px",
        padding: "10px",
        borderColor: "#c4c4c4",

    },
    "& .MuiDropzoneArea-textContainer": {
        fontSize: '2rem',
        padding: '2rem'
    },
    "& .MuiSvgIcon-root": {
        color: "#c4c4c4",
    },
    "& .MuiFormHelperText-root": {
        color: "#d32f2f",
        marginLeft: "14px",
    },
    "& p.MuiTypography-root": {
        font: "inherit",
        color:"inherit",
        "&::after": {
            color: "inherit",
        },
    },
});

const StyledCell = styled(TableCell)({
    textAlign: "center"
});
export const ACCEPTED_FILE_TYPES = ["image/gif", "image/svg", "image/jpg","image/jpeg", "image/png", ".txt", ".doc", ".docx", ".asice","application/pdf", ".xlsx", ".xls"];

export const MAX_SIZE_BYTES = 5000000;
const MainPage = () => {
    const [files, setFiles] = React.useState<IFile[]>([] as IFile[]);
    const [modalState, setModalState] = useState(false);
    const [isOpenDropzoneDialog, setIsOpenDropzoneDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState<IAlertMessage>({message: "", type: EAlertClass.Danger});
    const handleClose = () => {
        setModalState(!modalState);
        setAlertMessage({message: ""});
        reset();
    };
    const { setValue, getValues,  reset} = useForm<IFileForm>({defaultValues:  {
            name: "",
            data: "",
            type: ""
        }});
    const appState = useContext(AppContext);

    const loadData = useCallback(async () => {
        let result = await FormDataService.getAll<IFile>("files", appState.token!);
        if (result.ok && result.data) {
            setFiles(result.data);
        }
    }, [appState]);
    const handleDropzoneDialog = () => {
        setIsOpenDropzoneDialog(!isOpenDropzoneDialog)
    };
    const downloadFile = async (file: IFile) => {
        await fetch(ApiBaseUrl + "files/" + file.id, {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + appState.token
            }
        })
            .then(res => {
                res.blob().then(blob => {

                    FileSaver.saveAs(blob, file.name)
                })
            });
    };


    const handleFileSubmit = async () => {
        const url = "files";
        let data = new FormData();
        data.append('data', getValues("data"));
        let response = await FormDataService.post(url,data, appState.token!);
        if (response.ok) {
            setValue("data", "")
            setAlertMessage( {message:"File saved!", type: EAlertClass.Success});

            loadData();
        }else{
            setValue("data", "")
            setAlertMessage({message: response.message
                    ? response.message as string : "File upload failed!", type: EAlertClass.Danger});

        }
        setTimeout(() => {
            setAlertMessage({message: "", type: EAlertClass.Danger});

        }, 6000);
        handleDropzoneDialog();

    };
    const deleteFile = async (id: string) => {
        const url = "files/";

        let response = await BaseService.delete(url + id, appState.token!);
        if (response.ok) {
            loadData();
            setAlertMessage({message: "File deleted!", type: EAlertClass.Success});

        }else{
            setAlertMessage({message: response.message ? response.message as string : "File deletion failed!", type: EAlertClass.Danger});


        }
        setTimeout(() => {
            setAlertMessage({message: "", type: EAlertClass.Danger});

        }, 6000);
        setModalState(!modalState);
        return;
    };

    const handleDialogScreen = (
        file: IFile
    ) => {
        setValue("name", file.name);
        setValue("id", file.id);
        setModalState(!modalState);
    };
    useEffect(() => {
        loadData();
    }, [loadData]);


    return (
        <>
            <Grid data-testid={'mainPage'}>
                <div>
                    <DialogScreen handleClose={handleClose} isOpened={modalState}><AlertComponent
                        message={"Are you sure you want to delete the file " + getValues("name")}
                        show={true}
                        type={EAlertClass.Danger}
                    />
                        <div className={"deleteButton"}><Button
                            variant={"contained"}
                            color={"error"}
                            onClick={() => deleteFile(getValues("id"))}
                        >Delete</Button></div>

                    </DialogScreen>
                    <AlertComponent
                        show={alertMessage.message !== ""}
                        message={alertMessage.message}
                        type={alertMessage.type || EAlertClass.Danger}
                    />
                    {appState.token != null ? (
                        <div>
                            <div className={"fileUpload"}>
                                <Button
                                variant={"outlined"}
                                className={"fileUpload"}
                                onClick={handleDropzoneDialog}
                            >Add file</Button>
                            </div>

                            <Dialog
                                fullWidth={false}
                                maxWidth="xl"
                                open={isOpenDropzoneDialog}
                                onClose={handleDropzoneDialog}
                            >
                                <DialogContent>
                                    <DropZoneContainer  id="add-files-form">
                                        <DropzoneArea
                                            acceptedFiles={ACCEPTED_FILE_TYPES}
                                            dropzoneText={"Drag and drop a file here or click"}
                                            filesLimit={1}
                                            getDropRejectMessage={(
                                                rejectedFile: File,
                                                acceptedFiles: string[],
                                                maxFileSize: number
                                            ) => {
                                                return `common.fail ${
                                                    rejectedFile.name
                                                } common.rejected\n"Maximum file size allowed:" ${maxFileSize}\n
                      "Allowed file types:"
                    \n ${acceptedFiles.join(",\n")}`;
                                            }}
                                            getFileLimitExceedMessage={(filesLimit: number) => {
                                                return `"Number of files allowed" ${filesLimit}`;
                                            }}
                                            maxFileSize={MAX_SIZE_BYTES}
                                            showAlerts={["error", "success"]}
                                            showFileNames={true}
                                            showPreviews={false}
                                            showPreviewsInDropzone
                                            onChange={(file: any) => {
                                                setValue("data", file[0]);
                                            }}
                                        />
                                    </DropZoneContainer>
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        variant={"outlined"}
                                        onClick={handleDropzoneDialog}
                                    >Close</Button>

                                    <Button
                                        variant={"contained"}
                                        color={"info"}
                                        onClick={handleFileSubmit}
                                    >Submit</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    ): null}
                </div>
                <h1>File handler</h1>
                {appState.token === null ? <h3>You must be logged in to manage files!</h3> :null}
                {files.length === 0 ? null :
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell/>
                                <TableCell>
                                    <div>
                                        <h2>Name</h2>
                                    </div>

                                </TableCell>
                                <TableCell/>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.map((item, index) => (
                                <TableRow key={item.id}>
                                    <StyledCell>{index + 1}</StyledCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        {appState.token !== null ?
                                            <><Button variant={"text"}
                                                      onClick={() => downloadFile(item)}><DownloadIcon/></Button><Button
                                                variant={"text"} onClick={() => {
                                                handleDialogScreen(item);
                                            }} color={"error"} data-testid={'deleteButton'}><DeleteIcon/></Button></>
                                            : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
            </Grid>
        </>
    );
};
export default MainPage;
