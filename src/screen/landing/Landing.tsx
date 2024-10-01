import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

type Props = {};

const Landing = (props: Props) => {
  return (
    <div className="items-center h-screen justify-center">
      <Link to="/login">
        <Button variant="contained">Login</Button>
      </Link>
    </div>
  );
};

export default Landing;
