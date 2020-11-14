import React, { Component } from "react";
import Web3 from "web3";
import VisibilityOffOutlinedIcon from "@material-ui/icons/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";
import InfoIcon from "@material-ui/icons/Info";
import Swal from "sweetalert2";

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://127.0.0.1:8545/")
);

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      acc: [],
      color: "black",
      textColor: "black",
      error: "",
      isPasswordShown: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.togglePasswordVisibility.bind(this);
  }

  togglePasswordVisibility = () => {
    const { isPasswordShown } = this.state;
    this.setState({
      isPasswordShown: !isPasswordShown,
    });
    console.log(isPasswordShown);
  };

  clearError(){
    this.setState({
      error:""
    })
  }
  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleSubmit(event) {
    const { history } = this.props;
    event.preventDefault();
    if (this.state.value === "") {
      Swal.fire({
        text: "Password can't be blank!",
        fontsize: 25,
        fontWeight: "bold",
        width: "400px",
      });
    } else if (this.state.acc === undefined) {
      Swal.fire({
        text: "You still don't have an Account. Please sign up first!",
        fontSize: 28,
        fontWeight: "bold",
        width: "400px",
      });
    } else {
      web3.eth.personal
        .unlockAccount(this.state.acc, this.state.value)
        .then((response) => {
          console.log(response);
          history.push("/home");
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            error: "Password Incorrect!!",
          });
        });
    }
    this.setState({ value: "" });
  }
  async loadBlockchain() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ acc: accounts[0] });
    console.log(this.state.acc);
  }
  componentDidMount() {
    this.loadBlockchain();
  }

  render() {
    const { isPasswordShown } = this.state;
    return ( 
      
      <form
        onSubmit={this.handleSubmit}
        noValidate
        autoComplete="off"
        className="formcontainer"
      >
        <div style={{
            position:"absolute",
            left:"38%",
            top:10,
            fontWeight: "bold",
            fontFamily: "roboto",
            fontSize: 30,

          }}>Welcome to Ether Wallet</div>
        <div
          style={{
            textAlign: "center",
            alignItems: "center",
            fontWeight: "bold",
            fontFamily: "roboto",
            fontSize: 29,
          }}
        >
          <label>Sign In </label>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type={isPasswordShown ? "text" : "password"}
            placeholder="Enter Password"
            value={this.state.value}
            onChange={this.handleChange}
            onFocus={this.clearError.bind(this)}
            className="inputField"
            style={{ color: this.state.color }}
          />
          {this.state.value ? (
            isPasswordShown ? (
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
        <div style={{ paddingBlockEnd: 16 }}>
          <label style={{ fontSize: 17, color: "red" }}>
            {this.state.error}
          </label>
        </div>
        <div style={{ paddingBlockEnd: 30 }}>
          <button type="submit" className="btn btn-primary btn-block">
            Submit
          </button>
          <div style={{ display: "flex", paddingBlockStart: 8 }}>
            <InfoIcon fontSize="10" />
            <p>
              Wallet Password is the same with your first account's password
            </p>
          </div>
        </div>
        <div style={{ paddingBlock: 0 }}>
          <label
            style={{
              fontFamily: "roboto",
              fontSize: 20,
              fontWeight: "bold",
              alignItems: "center",
            }}
          >
            Don't Have an account? <a href="/sign-up"> Sign Up!</a>
          </label>
        </div>
      </form>
    );
  }
}
