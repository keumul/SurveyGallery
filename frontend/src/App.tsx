import React, { useState, useEffect } from "react";
import "./App.css";
import axiosClient from "./services/axiosInstance";
import { Route, Routes } from "react-router-dom";
import Home from "./home/welcome";
import Login from "./auth/login";
import Register from "./auth/register";

const App: React.FC = () => {
  // const client = axiosClient();
  // const [polls, setPolls] = useState<string[]>([]);

  // useEffect(() => {
  //   client
  //     .get("/poll")
  //     .then((response) => {
  //       setPolls(response.data.message);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching polls:", error);
  //     });
  // }, []);
  return (
    <>
    <Routes>
      <Route path='/home' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
    </Routes>
      {/* <h1 className="page-title">Survey Gallery</h1>
      <div className="poll-card-container">
        {polls.map((poll, index) => (
          <div key={index} className="poll-card">
            <div className="poll-label">Poll</div>
            <img src={poll} alt={"poll"} />
          </div>
        ))}
      </div> */}
    </>
  );
};

export default App;