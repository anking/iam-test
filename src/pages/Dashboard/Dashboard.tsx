import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { MainListItems, SecondaryListItems, Logout } from './menuItems';
import { useLocation } from 'react-router-dom'
import Dogs from './dogs';
import Konva from './konva';
import { DashboardContext, DashboardContextType } from '../../common/context/dashboardContext'
import { UserBookmarks, Bookmark } from '../../common/types/bookmarks';
import useLocalStorage from 'react-use-localstorage';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="#">
                Andrey Smirnov
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar
    },
    toolbarHeader: {
        margin: '0 auto'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    logo: {
        "& img": {
            width: 100
        }
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
    drawerPaper: {
        position: 'relative',
        whiteSpace: 'nowrap',
        //overflowX: 'hidden',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
        },
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
}));

interface DashboardProps {
    //pageSelected: number
}

const Dashboard = (props: DashboardProps) => {

    const classes = useStyles();
    const location = useLocation();
    const [LSdrawerOpen, setLSDrawerOpen] = useLocalStorage('menuDrawerOpen', "1");
    const [drawerOpen, setDrawerOpen] = useState(LSdrawerOpen === '1');    

    useEffect(() => {
        setDrawerOpen(LSdrawerOpen === '1')
    }, [LSdrawerOpen])

    const [userBookmarks, setUserBookmarks] = useState<UserBookmarks>({bookmarks:[]});

    //add dog bookmark
    const addBookmark = (bm: Bookmark) => {
        if (userBookmarks) {
            userBookmarks?.bookmarks.push(bm);
            setUserBookmarks({ ...userBookmarks, bookmarks: userBookmarks.bookmarks })
        }
    }

    //remove dog bookmark
    const removeBookmark = (bm: Bookmark) => userBookmarks && setUserBookmarks({ ...userBookmarks, bookmarks: userBookmarks?.bookmarks.filter(b => b.dogId !== bm.dogId) })

    const initialContext: DashboardContextType = {
        userBookmarks: userBookmarks,
        setUserBookmarks: setUserBookmarks,
        addBookmark: addBookmark,
        removeBookmark: removeBookmark
    }

    return <DashboardContext.Provider value={initialContext}>
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="absolute" className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setLSDrawerOpen("1")}
                        className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        {
                            location.pathname.split('/')[2]
                        }
                    </Typography>
                    <div className={classes.logo}>
                        <img alt="IAM logo" src="/logo.png" style={{height:50, width:50}} />
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
                }}
                open={drawerOpen}
            >
                <div className={classes.toolbarIcon}>
                    <Typography variant='h4' className={classes.toolbarHeader}>Dog Book</Typography>
                    <IconButton onClick={() => setLSDrawerOpen("0")}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List><MainListItems /></List>
                <Divider />
                <List><SecondaryListItems drawerOpen={drawerOpen} /></List>
                <Divider />
                <List><Logout /></List>
            </Drawer>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                <Container maxWidth="lg" className={classes.container}>
                    {
                        location.pathname.toLowerCase() === '/app/dogs'
                            ? <Dogs />
                            : <Konva />
                    }
                    <Box pt={4}>
                        <Copyright />
                    </Box>
                </Container>
            </main>
        </div>
    </DashboardContext.Provider>
}

export default Dashboard