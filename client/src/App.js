import React, { useEffect } from "react";

import { Authorization } from "./utils/Functions";
import { store } from "./store";
import { Provider } from "react-redux";
import { paths } from "./Router/Constant";
import persistor from "./persistStore";
import { PersistGate } from "redux-persist/integration/react";
import {
  BrowserRouter as Router,
  Routes,
  Navigate,
  Route,
} from "react-router-dom";
import { renderRoutes } from "./Router/Routes";
import { PrivateRoute } from "./Router/PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { ToastContainer } from "react-toastify";

const App = () => {
  useEffect(() => {
    !Authorization() && <Navigate to={paths.login} />;
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <div className="App d-flex flex-column h-100">
          <Router>
            <DefaultLayout />
            <Routes>
              <Route element={<PrivateRoute />}>
                {renderRoutes.map(([key, route]) => {
                  if (route.private === true) {
                    return (
                      <Route
                        key={key}
                        element={<route.component />}
                        path={route.path}
                        {...route}
                      />
                    );
                  }
                })}
              </Route>
              {renderRoutes.map(([key, route]) => {
                if (route.private === false) {
                  return (
                    <Route
                      key={key}
                      element={<route.component />}
                      path={route.path}
                      {...route}
                    />
                  );
                }
              })}
            </Routes>
          </Router>
        </div>
      </PersistGate>
    </Provider>
  );
};

export default App;
