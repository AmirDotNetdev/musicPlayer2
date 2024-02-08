import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./createRoomPage";
export default class Room extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
      updateSetting: false,
    };
    this.roomCode = this.props.match.params.roomCode;
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.getRoomDetails();
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.updateShowSettings = this.updateShowSettings.bind(this);
    this.renderButtonShowSettings = this.renderButtonShowSettings.bind(this);
  }

  updateShowSettings(value){
    this.setState({
      updateSetting: value,
    });
  }

  async getRoomDetails() {
    try {
      const response = await fetch(`/api/get-room?code=${this.roomCode}`);
      if (!response.ok) {
        throw new Error("Room not found");
      }
      const data = await response.json();
      this.setState({
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
      });
    } catch (error) {
      console.error("Error fetching room details:", error);
      // Handle error (e.g., redirect to home)
      this.props.leaveRoomCallBack();
      this.props.history.push("/");
    }
  }
  

  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room/", requestOptions).then((_response) => {
      this.props.leaveRoomCallBack();
      this.props.history.push("/");
    });
  }

  renderButtonShowSettings(){
    return(
      <Grid item align="center" xs={12}>
        <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(true)}>Settings</Button>
      </Grid>
    );
  }

  renderSettings(){
    return(
      <Grid container spacing={1}>
      <Grid item align="center" xs={12}>
        <CreateRoomPage update={true} guestCanPause={this.state.guestCanPause} votesToSkip={this.state.votesToSkip} code={this.roomCode} updateCallBack={this.getRoomDetails} />
      </Grid>
      <Grid item align="center" xs={12}>
      <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(false)}>close</Button>
      </Grid>
    </Grid>
    );
    
  }

  render() {
    if(this.state.updateSetting){
      return this.renderSettings();
    }
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Votes: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Guest Can Pause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h6">
            Host: {this.state.isHost.toString()}
          </Typography>
        </Grid>
        {this.state.isHost ? this.renderButtonShowSettings():null}
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={this.leaveButtonPressed}
          >
            Leave Room
          </Button>
        </Grid>
      </Grid>
    );
  }
}