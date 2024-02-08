    import React, { Component } from "react";
    import { render } from "react-dom";
    import Button from "@material-ui/core/Button";
    import Grid from "@material-ui/core/Grid";
    import Typography from "@material-ui/core/Typography";
    import TextField from "@material-ui/core/TextField";
    import FormHelperText from "@material-ui/core/FormHelperText";
    import FormControl from "@material-ui/core/FormControl";
    import Radio from "@material-ui/core/Radio";
    import RadioGroup from "@material-ui/core/RadioGroup";
    import FormControlLabel from "@material-ui/core/FormControlLabel";
    import {Link} from "react-router-dom";
    import { useHistory } from 'react-router-dom';
    import { Collapse } from "@material-ui/core";
    import Alert from "@material-ui/lab/Alert"
    export default class CreateRoomPage extends Component {
    static defaultProps = {
      guestCanPause : true,
      votesToSkip : 2,
      update : false,
      updateCallBack : () => {},
      code : null,
    };
    constructor(props) {
      
      super(props);
      this.state = {
        guestCanPause: this.props.guestCanPause,
        votesToSkip: this.props.votesToSkip,
      }
      this.handleGuestCanpauseChange = this.handleGuestCanpauseChange.bind(this);
      this.handleVotesChange = this.handleVotesChange.bind(this);
      this.handleButtonPressed = this.handleButtonPressed.bind(this); 
      this.renderCreateButtons = this.renderCreateButtons.bind(this);
      this.renderUpdateButtons = this.renderUpdateButtons.bind(this);
      this.handleUpdateButtonPressed = this.handleUpdateButtonPressed.bind(this);


    }
    defaultVotes = 2;

    handleButtonPressed() {
      const url = '/api/create-room/';
      const requestOptions = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_can_pause: this.state.guestCanPause,
          votes_to_skip: this.state.votesToSkip,
          msgSuccess :'',
          msgError : '',
        }),
      };

      fetch(url, requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => this.props.history.push(`/room/${data.code}`))
        .catch((error) => console.error('Error:', error));
    }



    handleVotesChange(e){
      this.setState({
        votesToSkip: e.target.value,
      })
    }

    handleGuestCanpauseChange(e){
      this.setState({
        guestCanPause: e.target.value === "true" ? true:false,
      })
    }

    renderCreateButtons(){
      return(
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Button color="primary" variant="contained" onClick={this.handleButtonPressed}>Create Room</Button>
          </Grid>
          <Grid item xs={12} align="center">
            <Button color="secondary" variant="contained">Back</Button>

          </Grid>
      </Grid>
      );
      
    }
    renderUpdateButtons(){
      return(
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
            <Button color="primary" variant="contained" onClick={this.handleUpdateButtonPressed}>Update Room</Button>
          </Grid>
          </Grid>
      );
      
    }
    handleUpdateButtonPressed() {
      const url = '/api/update-room/';
      const requestOptions = {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_can_pause: this.state.guestCanPause,
          votes_to_skip: this.state.votesToSkip,
          code: this.props.code,
        }),
      };
    
      fetch("/api/update-room/", requestOptions).then((response) => {
        if (response.ok) {
          this.setState({
            msgSuccess: "Room updated successfully!",
          });
        } else {
          this.setState({
            msgError: "Error updating room...",
          });
        }
        this.props.updateCallBack();
      });
    }
    

    render() {
      const title = this.props.update ? "Update a Room" : "Create a Room"
      return (
       
          
        
        
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
          <Collapse in={this.state.msgError != "" || this.state.msgSuccess != ""}>
          {this.state.msgSuccess =! "" 
          ? (<Alert
           severity="success"
            onClose={() => {this.setState({msgSuccess : ""})}}>

            </Alert>) 
            : (<Alert
             severity="success"
              onClose={() => {this.setState({msgError : ""})}}>
                
              </Alert>)}
        </Collapse>
          </Grid>
          <Grid item xs={12} align="center">
            <Typography component="h4" variant="h4">{title}</Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl component="fieldset">
              <FormHelperText>
                <div align="center">
                  Guest Control Playback Of State
                </div>
              </FormHelperText>
              <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanpauseChange}>
                <FormControlLabel value= "true"
                control={<Radio color="primary"/>}
                label="Play/Pause"
                labelPlacement="bottom"
                />
                <FormControlLabel value="false" 
                control={<Radio color="secondary"/>}
                label="No control"
                labelPlacement="bottom"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} align="center">
            <FormControl>
              <TextField 
              onChange={this.handleVotesChange} 
              required={true}
              type="number"
              defaultValue={this.state.votesToSkip}
              inputProps={{
                min : 1,
                style : {textAlign : "center"}
              }}
              />
            <FormHelperText>
              <div align="center">Votes Requierd To Skip Song</div>
            </FormHelperText>


            </FormControl>

          </Grid>
          {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
        </Grid>
      );
    }
    }

    const appDiv = document.getElementById("app");
    render(<CreateRoomPage />, appDiv);
