import React from "react";
import { Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import SignUp from "../signup";

const AnalyticsDashboard = lazy(() =>
  import("../analyticsDashboard")
);
const SignInSide = lazy(() =>
  import("../login")
);


export default function AllRoutes() {
  return (
    <Suspense
      fallback={
        <div className="loader">
         <div id="loading-spinner">
           <div className="spinner outer">
             <div className="spinner inner">
               <div className="spinner eye"></div>
             </div>
           </div>
         </div>
        </div>
      }
    >
      <Routes>
        <Route path={"/AnalyticsDashboard"} element={<AnalyticsDashboard/>} />
        <Route path={"/"} element={<SignInSide/>} />
        <Route path={"/singUp"} element={<SignUp/>} />
       
      </Routes>
    </Suspense>
  );
}
