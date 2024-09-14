import { Provider } from 'react-redux';
import store from '../store/store';
import '../styles/globals.css'; 
import type { AppProps } from 'next/app';
import Heading from '@/components/Heading';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
        <Heading text="GitHub Usuários" />
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default MyApp;
