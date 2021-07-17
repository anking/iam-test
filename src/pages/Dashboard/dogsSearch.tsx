import React, { useState, useEffect } from 'react';
import { TextField, Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import useDebounce from 'common/hooks/debounce'
import { useDebouncedEffect } from 'common/hooks/debouncedEffect'
import Backend from 'common/backend';
import { useLocation } from 'react-router-dom';
import { Location } from 'history'
import PCancelable from 'p-cancelable';
import { DogLite } from '../../common/types/dogs';


interface LocationState {
    searchDogName?: string;
    resetSearch?: boolean;
}

interface DogsSearchProps {
    resultsCallback: (results: any) => void,
    searchingIndicator?: (isSearching: boolean) => void
}

export const DogsSearch = (props: DogsSearchProps) => {

    let location = useLocation() as Location<LocationState>;

    const [breedName, setBreedName] = useState<string>('');
    const debouncedBreedName = useDebounce(breedName, 500); //500 ms delay

    const [lastSearchPromise, setLastSearchPromise] = useState<PCancelable<any> | null>(null); //search promise    

    const { searchingIndicator, resultsCallback } = props;

    const [noticeOpen, setNoticeOpen] = useState(false);

    //pull dog automatically if redirected from the bookmark
    useEffect(() => {
        if (location && location.state && location.state.searchDogName) {
            setBreedName(location?.state?.searchDogName || '')
        } else if (location && location.state && location.state.resetSearch) {
            setBreedName('')
        }
    }, [location]);

    //search when the text inputs change
    useDebouncedEffect(
        () => {
            // Make sure we have a value (user has entered something in input)

                // Set isSearching state
                searchingIndicator && searchingIndicator(true)

                // Fire off our API call
                let pr = searchCharacters();

                lastSearchPromise?.cancel();    //cancel any previous search
                setLastSearchPromise(pr);       //save new search promise so it can becancelled later

                pr.then((result: any) => {

                    if (result) {
                        if (result.length) {
                            // Set results state
                            resultsCallback(result)
                        }
                        else {
                            resultsCallback([])
                            setNoticeOpen(true)
                        }
                    }
                })
                    .catch(console.log)
                    .finally(() => {
                        // Set back to false since request finished
                        searchingIndicator && searchingIndicator(false)
                    })
        },

        [debouncedBreedName],
        50 //introduce small delay to wait for all state values to update
    );

    // API search function
    const searchCharacters = (): PCancelable<DogLite[]> => {
        if(debouncedBreedName){
            return Backend.get<DogLite[]>('breeds/search?q='+debouncedBreedName);
        }
        else {
            return Backend.get<DogLite[]>('breeds')
        }
    }

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
    </>

}

export default DogsSearch;