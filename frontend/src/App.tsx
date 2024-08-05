import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./home/main";
import Login from "./auth/login";
import Register from "./auth/register";
import Poll from "./home/poll";
import Editor from "./home/editor";

const App: React.FC = () => {
  return (
    <>
    <Routes>
      <Route path='/home' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path={`/editor`} element={<Editor />} />
      <Route path={`/poll/:pollId`} element={<Poll />} />
    </Routes>
      {}
    </>
  );
};

export default App;