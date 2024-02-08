import React, { Component } from "react";
import { render } from "react-dom";
import { Grid, Button, Typography, TextField, } from '@material-ui/core';
import { Link } from 'react-router-dom';
export default class JoinRoomPage extends Component {
  constructor(props) {
    super(props);
    this.state={
      error:"",
      code:""
    }
    this._handleTextFieldChanged = this._handleTextFieldChanged.bind(this);
    this._handleButtonPressed = this._handleButtonPressed.bind(this);
  }

  render() {
    return (
      <Grid container spacing={1} >
        <Grid item xs = {12} align="center">
          <Typography variant="h4" component="h4">
            Join Room Page
          </Typography>
        </Grid>
        <Grid item xs = {12} align="center">
          <TextField 
          error={this.state.error}
          label = "code"
          placeholder = "Enter Room Code"
          value = {this.state.code}
          helperText = {this.state.error}
          variant="outlined"
          onChange={this._handleTextFieldChanged}
          />
        </Grid>
        <Grid item xs = {12} align="center">
          <Button color="primary"  variant="contained" onClick={this._handleButtonPressed}>Join</Button>
        </Grid>
        <Grid item xs = {12} align="center">
          
          <Button color="secondary"  variant="contained" >Back</Button>
          
          
        </Grid>
      </Grid>
    );
  }
  _handleTextFieldChanged(e){
    this.setState({
      code: e.target.value,
    });
  }
  _handleButtonPressed(){
    const url = "/api/join-room/";
    const requestOptions = {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        code: this.state.code
      })
    };
    fetch(url, requestOptions).then((response) => {
      if (response.ok){
        this.props.history.push(`/room/${this.state.code}`);
      }else{
        this.setState({
          error: 'Room not found.'
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}

const appDiv = document.getElementById("app");
render(<JoinRoomPage />, appDiv);
