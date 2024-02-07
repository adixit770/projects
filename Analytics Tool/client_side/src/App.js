import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./pages/routes";

function App() {
 

  return (
<>
    <BrowserRouter>
        <AllRoutes />
  </BrowserRouter>

   
    </>
  );
}

export default App;
