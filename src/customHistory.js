import { createBrowserHistory } from 'history'

const history = createBrowserHistory({
    basename: process.env.PUBLIC_URL //'webapp'
})

export default history

// import { useNavigate } from 'react-router-dom';

// const navigate = useNavigate();

// export default navigate;