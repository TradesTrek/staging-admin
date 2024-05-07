import '../styles/tailwind.css';
import '../styles/FormSpinner.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { userService } from '../services';
import { Provider } from 'react-redux';
import store from '../store';
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // run auth check on initial load
    authCheck(router.asPath);

    // set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // run auth check on route change
    router.events.on('routeChangeComplete', authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = ['/login', '/'];
    const path = url.split('?')[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push('/');
    } else {
      setAuthorized(true);
      // if (router.pathname == '/login' || router.pathname == '/') {
      //   router.push("/dashboard");
      // }
    }
  }
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;