import React, { Component } from "react";
import { render } from "react-dom";
import CreateRoomPage from "./createRoomPage";
import JoinRoomPage from "./joinRoomPage";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Room from "./room";
import { Button, ButtonGroup, Typography, Grid } from "@material-ui/core";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: null,
    };
    this.clearRoomCode = this.clearRoomCode.bind(this);
  }

  async componentDidMount() {
    const url = "/api/user-in-room/";
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.code);
      this.setState({ code: data.code });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  clearRoomCode(){
    this.setState({
      code : null,
    })
  }

  renderHomepage() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <Typography variant="h3" component="h3">
            House Party
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <ButtonGroup disableElevation variant="contained" color="primary">
            <Button color="primary" variant="contained" to="/create" component={Link}>
              Create a room
            </Button>
            <Button color="secondary" variant="contained" to="/join" component={Link}>
              Join a room
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
    );
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/join" component={JoinRoomPage} />
          <Route path="/create" component={CreateRoomPage} />
          <Route path="/room/:roomCode" render ={(props)=>{
            return <Room {...props} leaveRoomCallBack={this.clearRoomCode}/>
          }} />
          <Route
            exact
            path="/"
            render={() => {
              return this.state.code ? <Redirect to={`/room/${this.state.code}`} /> : this.renderHomepage();
            }}
          />
        </Switch>
      </Router>
    );
  }
}

const appDiv = document.getElementById("app");

render(<HomePage />, appDiv);
