import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store.ts';
import { ApolloProvider } from '@apollo/client';
import { client } from './ApolloClient.ts';
import { PersistGate } from 'redux-persist/integration/react';


// Render the app
createRoot(document.getElementById('root')!).render(
    <ApolloProvider client={client}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <Provider store={store}>
                <App />
            </Provider>
        </PersistGate>
    </ApolloProvider>
);