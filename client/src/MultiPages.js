import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import App from "./App";
import UserOrAdmin from "./components/UserOrAdminSelection/UserOrAdminSelection";
import PendingPage from "./components/Pages/Pending";
import BlockedUser from "./components/Pages/BlockedUser";
function MultiPages() {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<App />} />
                <Route path="https://inventory-sys-deploy.vercel.app/profile" element={<UserOrAdmin />} />
                <Route path="/pending" element={<PendingPage />} />
                <Route path="/blocked" element={<BlockedUser />} />




            </Routes>
        </Router>
    );
}
 
export default MultiPages;
