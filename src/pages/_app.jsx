import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "tailwindcss/tailwind.css";
import "../configs/locale";

import PrimeReact from "primereact/api";
PrimeReact.cssTransition = true;
PrimeReact.inputStyle = 'outlined';
PrimeReact.inputStyle = 'filled';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
