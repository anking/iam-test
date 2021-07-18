import { useContext, useState } from 'react';
import { Grid, Paper, TableContainer, Table, TableCell, TableRow, TableHead, TableBody, IconButton, LinearProgress, Tooltip } from '@material-ui/core';
import Backend from '../../common/backend';
import Modal from '../../components/Modal';
import DogsSearch from './dogsSearch';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import ImageIcon from '@material-ui/icons/Image';
import { DogLite, GetImageResponse } from '../../common/types/dogs';
import { DashboardContext, DashboardContextType } from '../../common/context/dashboardContext';
import Alert from '@material-ui/lab/Alert';



const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column'
    },
    fixedHeight: {
        //height: 240,
    }
}));


interface DogsProps {
    //resultsCallback: (results: any)=>void
}


export const Dogs = (props: DogsProps) => {
    const classes = useStyles();

    const dContext = useContext<DashboardContextType>(DashboardContext);

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    const [dogsResult, setDogsResult] = useState<DogLite[]>([]);
    const [image, setImage] = useState<GetImageResponse | null>(null);
    const [imageError, setImageDocumentError] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    //Request Image api call
    const requestImage = (imageId: string) => {

        setImageDocumentError(false)
        setImageModalOpen(true)

        return Backend.get<GetImageResponse>('images/' + imageId)
            .then(r => {
                if (r?.status === 400) {
                    setImageDocumentError(true)
                    setImage(null)
                }
                else {
                    setImage(r)
                }
            })
            .catch(e => {
                console.log(e)
                setImageDocumentError(true)
            });
    }

    return <>
        <Grid container spacing={3}>
            {/* Search Dogs */}
            <Grid item xs={12}>
                <Paper className={fixedHeightPaper}>
                    <DogsSearch resultsCallback={(val) => setDogsResult(val)} searchingIndicator={setIsSearching} />
                </Paper>
            </Grid>
            {/* Results of order search */}
            <Grid item xs={12}>
                <Paper className={fixedHeightPaper}>
                    {
                        !isSearching
                            ? <TableContainer component={Paper}>
                                <Table size="small" aria-label="a dense table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Breed Name</TableCell>
                                            <TableCell align="right">Height</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            dogsResult?.slice(0,30).map(dog => (
                                                <TableRow key={dog.id}>
                                                    <TableCell align="left">
                                                        <Tooltip 
                                                        enterDelay={dContext.userBookmarks?.bookmarks.find(bm => bm.dogId === dog.id) ? 150 : 500} 
                                                        title={dContext.userBookmarks?.bookmarks.find(bm => bm.dogId === dog.id) ? 'Remove Bookmark' : 'Add to bookmarks'}
                                                        >
                                                        {/* <Tooltip enterDelay={150} title='Remove Bookmark'> */}
                                                            <IconButton onClick={() => {
                                                                //if bookmark already exists, do not add it, remove it instead
                                                                if (dContext.userBookmarks?.bookmarks.find(bm => bm.dogId === dog.id)) {
                                                                    dContext.removeBookmark({ dogId: dog.id, name: dog.name });
                                                                } else {
                                                                    dContext.addBookmark({ dogId: dog.id, name: dog.name });
                                                                }
                                                            }
                                                            }>
                                                                {
                                                                    dContext.userBookmarks?.bookmarks.find(bm => bm.dogId === dog.id)
                                                                        ? <BookmarkIcon />
                                                                        : <BookmarkBorderIcon />
                                                                }
                                                            </IconButton>
                                                        </Tooltip>
                                                        {dog.name}
                                                    </TableCell>
                                                    <TableCell align="right">{dog.height.imperial}in</TableCell>
                                                    <TableCell align="right">
                                                        {
                                                            <Tooltip title={"View " + dog.name + " Image"}><IconButton onClick={() => { requestImage(dog.reference_image_id) }}><ImageIcon /></IconButton></Tooltip>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            : <LinearProgress style={{ minWidth: "300px" }} />
                    }
                </Paper>
            </Grid>
        </Grid>

        {/* Image Modal */}
        <Modal
            open={imageModalOpen}
            title={(image?.breeds?.[0]?.name) || (imageError ? "Error" : "Loading...")}
            onClose={() => { setImageModalOpen(false) }}
        >
            {
                image
                    ? <img src={image?.url} style={{ width: 500 }} alt="dog" />
                    : imageError ? <Alert severity="error">Error Downloading Image</Alert> : <LinearProgress style={{ minWidth: 400 }} />
            }
        </Modal>
    </>
}

export default Dogs;