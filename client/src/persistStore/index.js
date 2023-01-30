import { persistStore } from "redux-persist";
import {store} from "../store/index";

let persistor = persistStore(store);
export default persistor;
