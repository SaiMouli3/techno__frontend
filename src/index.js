import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerLicense } from "@syncfusion/ej2-base";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ContextProvider } from "./context/ContextProvider";
import store from './store';
import { Provider } from "react-redux";
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NBaF5cXmRCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxdcHRVR2FcVEV/WUI="
);
const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient()
root.render(
  <React.StrictMode>
    <Provider store={store}>
     <QueryClientProvider client={queryClient}>
     <ContextProvider>
      <App />
    </ContextProvider>
     </QueryClientProvider>
     </Provider>
  </React.StrictMode>
);
