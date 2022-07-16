import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

// import { setupStore } from './store/index';

import './sass/style.scss'

import App from './App';

const container = document.querySelector('.main-wrapper') as HTMLElement;
const root = ReactDOM.createRoot(container);
// const store = setupStore();

root.render(
    <Router>
        {/* <Provider store={store}> */}
            <App />
        {/* </Provider> */}
    </Router>
);  
