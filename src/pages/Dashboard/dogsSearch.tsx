import { useState, useEffect } from 'react';
import { TextField, Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useDebounce from 'common/hooks/debounce'
import { useLocation } from 'react-router-dom';
import { Location } from 'history'
import { useQuery } from 'react-query';
import * as api from '../../common/dogapi';


interface LocationState {
    searchDogName?: string;
    resetSearch?: boolean;
}

interface DogsSearchProps {
    resultsCallback: (results: any) => void,
    searchingIndicator: (isSearching: boolean) => void
}

export const DogsSearch = (props: DogsSearchProps) => {

    let location = useLocation() as Location<LocationState>;

    const { searchingIndicator, resultsCallback } = props;

    const [breedName, setBreedName] = useState<string>('');
    const debouncedBreedName = useDebounce(breedName, 500); //500 ms delay      

    const [noticeOpen, setNoticeOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    //pull dog automatically if redirected from the bookmark
    useEffect(() => {
        if (location && location.state && location.state.searchDogName) {
            setBreedName(location?.state?.searchDogName || '')
        } else if (location && location.state && location.state.resetSearch) {
            setBreedName('')
        }
    }, [location])

    //if results are empty show the toast
    const checkIfEmpty = (dt: any) => !dt.length ? setNoticeOpen(true) : setNoticeOpen(false)

    //search dogs if there is a query or fetch the entire list if empty
    const allDogs = useQuery(['dogsFetch', debouncedBreedName], () => debouncedBreedName ? api.searchDogs(debouncedBreedName) : api.getAllDogs(), { onSuccess: checkIfEmpty, onError:()=>setErrorOpen(true) });

    //show loading indicator during fetch
    useEffect(() => { allDogs.isLoading && searchingIndicator(true) }, [allDogs.isLoading, searchingIndicator]);

    //send results back to main component once fetched
    useEffect(() => {        
        if (allDogs.isFetched) {
            resultsCallback(allDogs.data)

            searchingIndicator(false)
        }
    }, [allDogs.isFetched, allDogs.data, resultsCallback, searchingIndicator]);

    return <>
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={6}>
                <TextField
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    label="Breed Name"
                    autoFocus
                    value={breedName}
                    onChange={e => setBreedName(e.target.value)}
                    size='small'
                />
            </Grid>
        </Grid>

        <Snackbar open={noticeOpen} autoHideDuration={6000} onClose={() => setNoticeOpen(false)}>
            <MuiAlert severity="info" elevation={6} variant="filled">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;No results&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</MuiAlert>
        </Snackbar>
        

        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={() => setErrorOpen(false)}>
            <MuiAlert severity="error" elevation={6} variant="filled">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Error fetching data&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</MuiAlert>
        </Snackbar>
    </>

}

export default DogsSearch;