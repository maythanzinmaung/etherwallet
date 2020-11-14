import React, { Component } from "react";
import Web3 from "web3";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import Swal from "sweetalert2";
import { TextField } from "@material-ui/core";

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://127.0.0.1:8545/")
);
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      acc: "",
      confirm: "",
      error: "",
      isPasswordShown: false,
      isConfirmShown: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
    this.toggleConfirmVisibility = this.toggleConfirmVisibility.bind(this);
  }

  togglePasswordVisibility = () => {
    const { isPasswordShown } = this.state.isPasswordShown;
    this.setState({
      isPasswordShown: !isPasswordShown,
    });
  };

  toggleConfirmVisibility = () => {
    const { isConfirmShown } = this.state.isConfirmShown;
    this.setState({
      isConfirmShown: !isConfirmShown,
    });
  }

  clearError() {
    this.setState({
      error: "",
    });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleConfirm(event) {
    this.setState({
      confirm: event.target.value,
    });
    // console.log(this.state.confirm)
    //this.validate();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.value !== "" && this.state.confirm !== "") {
      if (this.state.value === this.state.confirm) {
        web3.eth.personal
          .newAccount(this.state.value)
          .then((response) => {
            console.log(response);
            Swal.fire({
              title: "SignUp Successful!!",
              text: `Your Account Address is "${response}"`,
              footer: "Please login again!!",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        this.setState({
          error: "Passwords didn't match",
          value: "",
          confirm: "",
        });
      }
    } else {
      Swal.fire("Password field can't be blank");
    }
  }
  validatePassword() {
    console.log(this.state.confirm);
    if (this.state.value !== this.state.confirm) {
      this.setState({
        error: "Passwords didn't match",
      });
    }
  }
  async loadBlockchain() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ acc: accounts[0] });
  }
  componentDidMount() {
    this.loadBlockchain();
  }

  render() {
    return (
      <form
        onSubmit={this.handleSubmit}
        autoComplete="off"
        className="formcontainer"
      >
        <div
          style={{
            textAlign: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontFamily: "roboto",
            fontSize: 30,
            paddingBlockEnd: 40,
          }}
        >
          <label>Sign Up </label>
          <label>(Creating First Account)</label>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingBlockEnd: 30,
          }}
        >
          <TextField
            id="standard-basic"
            label="Enter Password"
            type={this.state.isPasswordShown ? "text" : "password"}
            value={this.state.value}
            onChange={this.handleChange}
            onFocus={this.clearError.bind(this)}
            className="inputField"
            style={{ color: this.state.color }}
          />
          {this.state.value ? (
            this.state.isPasswordShown ? (
              <VisibilityOutlinedIcon
                fontSize="small"
                style={{ position: "relative", top: 13 }}
                onClick={this.togglePasswordVisibility}
              />
            ) : (
              <VisibilityOffOutlinedIcon
                fontSize="small"
                style={{ position: "relative", top: 13 }}
                onClick={this.togglePasswordVisibility}
              />
            )
          ) : (
            <p></p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            id="standard-basic"
            label="Confirm Password"
            type={this.state.isConfirmShown ? "text" : "password"}
            value={this.state.confirm}
            onChange={this.handleConfirm}
            onFocus={this.clearError.bind(this)}
            className="inputField"
            style={{ color: this.state.color }}
          />
          {this.state.confirm ? (
            this.state.isConfirmShown ? (
              <VisibilityOutlinedIcon
                fontSize="small"
                style={{ position: "relative", top: 13 }}
                onClick={this.toggleConfirmVisibility}
              />
            ) : (
              <VisibilityOffOutlinedIcon
                fontSize="small"
                style={{ position: "relative", top: 13 }}
                onClick={this.toggleConfirmVisibility}
              />
            )
          ) : (
            <p></p>
          )}
        </div>
        <div style={{ paddingBlockEnd: 30 }}>
          <label style={{ fontSize: 17, color: "red" }}>
            {this.state.error}
          </label>
        </div>
        <div style={{ paddingBlockEnd: 30 }}>
          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
        </div>
        <div>
          <label
            style={{
              fontFamily: "roboto",
              fontSize: 20,
              fontWeight: "bold",
              alignItems: "center",
            }}
          >
            Go back to <a href="/sign-in">Sign In</a> Page!!
          </label>
        </div>
      </form>
    );
  }
}
