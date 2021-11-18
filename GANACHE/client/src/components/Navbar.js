import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontSize: 40,
    textAlign: "center"
  },
}));

export default function Navbar({account,result}) {
  const classes = useStyles();
 
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor:"#5280E2"}}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
          E-Voting Network
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}