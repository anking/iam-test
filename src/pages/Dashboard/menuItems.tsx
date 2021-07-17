import React, { useContext, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PetsIcon from '@material-ui/icons/Pets';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Cognito from '../../authentication/cognito';
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Tooltip } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import Backend from '../../common/backend';
import { UserBookmarks } from '../../common/types/bookmarks'
import { DashboardContext, DashboardContextType } from '../../common/context/dashboardContext'


interface listItemsProps {
    drawerOpen: boolean;
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'unset',
        padding: 0
    },
    accordionRoot: {
        boxShadow: 'unset',
        margin: '0 !important',
        '&:before': {
            backgroundColor: 'unset'
        }
    },
    accordionSummaryContent: {
        margin: '0 !important'
    },
    accordionSummaryRoot: {
        minHeight: 'unset !important'
    }
}));

export const MainListItems = () => {

    const navigate = useNavigate();

    return <div>
        <ListItem button onClick={() => navigate('/app/Dashboard')}>
            <Tooltip title='Dashboard'>
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem button onClick={() => navigate('/app/Dogs', { state: { resetSearch: true } })}>
            <Tooltip title='Dogs'>
                <ListItemIcon>
                    <PetsIcon />
                </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Dogs" />
        </ListItem>
    </div>
}

export const SecondaryListItems = (props: listItemsProps) => {
    const { drawerOpen } = props;

    const classes = useStyles();

    const navigate = useNavigate();

    const dContext = useContext<DashboardContextType>(DashboardContext);

    useEffect(() => {
        Backend.get<UserBookmarks>('dogs/GetBookmarks')
            .then(res => dContext.setUserBookmarks(res))
            .catch(console.log)
    }, []);

    return <>
        { drawerOpen && <ListSubheader inset>Saved dogs</ListSubheader>}

        {
            //bookmarkCatalogs
            dContext && dContext.userBookmarks && dContext.userBookmarks.bookmarks
            && drawerOpen
            && dContext.userBookmarks.bookmarks.map(bm =>
                <ListItem key={bm.dogId.toString()} button onClick={() => navigate('/app/Dogs', { state: { searchDogName: bm.name } })}>
                    <ListItemIcon>
                        <AssignmentIcon />
                    </ListItemIcon>
                    <Tooltip enterDelay={750} title={bm.name}>
                        <ListItemText style={{ overflow: 'hidden' }} primary={bm.name} />
                    </Tooltip>
                </ListItem>
            )
        }
    </>
}


export const Logout = () => {

    const navigate = useNavigate();

    return <>
        <ListItem button onClick={() => { Cognito.getUser()?.signOut(); navigate('/login') }}>
            <Tooltip title='Logout'>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
            </Tooltip>
            <ListItemText primary="Logout" />
        </ListItem>
    </>
}