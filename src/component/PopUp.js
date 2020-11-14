import React from "react";
import "./popupstyle.css";
import { withStyles, Divider, Button } from "@material-ui/core";
import Web3 from "web3";
import Swal from "sweetalert2";

const web3 = new Web3(
  new Web3.providers.HttpProvider("http://127.0.0.1:8545/")
);
const today=new Date();
class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      age: "",
      value: 0,
      receiverInput: "",
      amount: "",
      open: false,
      sender: "",
      receiver: "",
      senderError: "",
      receiverError: "",
      amountError: "",
      h: "",
    };
    this.submitTransfer = this.submitTransfer.bind(this);
  }

  async confirmTransaction() {
    if (
      Object.keys(this.state.receiverInput).length === 0 ||
      Object.keys(this.state.amount).length === 0
    ) {
      if (Object.keys(this.state.receiverInput).length === 0) {
        this.setState({ receiverError: "Receiver Address can't be blank" });
      }
      if (Object.keys(this.state.amount).length === 0) {
        this.setState({ amountError: "Amount can't be blank" });
      }
    } else {
      this.submitTransfer();
    }
  }

  async submitTransfer() {
    const accounts = await web3.eth.getAccounts();
    const amount = this.state.amount.toString();
    this.setState({ sender: accounts[this.state.value], amount: amount });
    const amountInWei = web3.utils.toWei(amount, "ether");
    var str = this.state.receiverInput;
    if (str.split(" ").includes("Account")) {
      const no = str.replace(/^\D+/g, "");
      const receiverIndex = Number(no) - 1;
      this.setState({ receiver: accounts[receiverIndex] });
    } else {
      this.setState({ receiver: str });
    }

    Swal.fire({
      title: "Transaction Details ",
      width: "600px",
      padding: "0em",
      html: `<br /><div className="swal-body"> Sender : ${this.state.sender}</div><div>-----------------------------------------------------------------------------------</div><div>
      Receiver : ${this.state.receiver}</div><div>-----------------------------------------------------------------------------------</div>
       <div> Amount : ${this.state.amount} ethers</div><div>-----------------------------------------------------------------------------------</div>
       <div> Gas Price : 0.00000000000002 ethers</div><div>-----------------------------------------------------------------------------------</div><br /><br /><br /> <div>Enter your sender account's password to complete transaction!</div>
      `,
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showConfirmButton: true,
      confirmButtonText: "Send",
      showCancelButton: true,
      cancelButtonText: "Back",
      reverseButtons: true,
      customClass: {
        button: "swal-button",
        title: "swal-title",
        html: "swal-html",
        input: "swal-input",
      },
      showLoaderOnConfirm: true,
      preConfirm: (password) => {
        return web3.eth.personal
          .unlockAccount(this.state.sender, password)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            Swal.showValidationMessage(`Wrong Password. Please try again!!`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      
      if (result.value) {
        Promise.resolve().then(()=>{
          web3.eth
          .sendTransaction({
            from: this.state.sender,
            to: this.state.receiver,
            value: amountInWei,
          })
          .on("transactionHash", function (hash) {
            console.log(hash)
            Swal.fire({
              title: "Transaction Sent!!",
              html: `Your transaction hash is <b>${hash}</b>`,
              footer:
                "Transaction almost finished!! Please wait for a second to be confirmed!",
            });
          })
          .then(this.props.reload()
          
          )
          .catch(error =>{
            if(error)
            Swal.fire({
              icon:'error',
              title:'Oops...',
              text:'Insufficient funds to transfer!!',
              footer:'You must have enough " transaction amount + transaction fee " to make transaction!!'
            })
            alert(error)
          })
          return Promise.reject("Invalid Address")
        })
        
      }
    });
    this.setState({ receiverInput: "", amount: "" });

    window.addEventListener("unhandledrejection", function(e) {
      console.log(e);
      // alert(`unhandledrejection: ${e.reason}`);
      Swal.fire({
          icon:'error',
          title:'Oops...',
          text:`${e.reason}`,
          footer:'Please enter a Valid Ethereum Address!!'
        })
    });
  }
  
  handleSender(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleReceiver(event) {
    this.setState({
      receiverInput: event.target.value,
    });
  }

  handleAmount(event) {
    this.setState({
      amount: event.target.value,
    });
  }

  clearAError() {
    this.setState({ amountError: "" });
  }

  clearRError() {
    this.setState({ receiverError: "" });
  }

  render() {
    return (
      <div className="popup">
        <div className="inner">
          <div
            style={{
              textAlign: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontFamily: "roboto",
              fontSize: 30,
            }}
          >
            <label>Ether Transaction</label>
          </div>
          <Divider />
          <div className="sender">
            <label className="label">From : </label>
            <select
              value={this.state.value}
              onChange={this.handleSender.bind(this)}
              className="select"
            >
              {this.props.accountState.map((acc, index) => (
                <option value={index} key={acc}>
                  Account {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div>{this.state.senderError}</div>
          <div className="receiver">
            <label className="label">To : </label>
            <input
              type="text"
              className="receiverInput"
              list="own"
              value={this.state.receiverInput}
              onChange={this.handleReceiver.bind(this)}
              onFocus={this.clearRError.bind(this)}
            />
            <datalist id="own">
              {this.props.accountState.map((acc, index) => (
                <option
                  key={acc}
                  data-value={index}
                  value={`Account ${index + 1}`}
                ></option>
              ))}
            </datalist>
            <label className="error"> {this.state.receiverError}</label>
          </div>

          <div>
            <label className="label">Amount: </label>
            <input
              type="number"
              className="select"
              value={this.state.amount}
              onChange={this.handleAmount.bind(this)}
              onFocus={this.clearAError.bind(this)}
            />
            <label className="error">{this.state.amountError}</label>
          </div>
        </div>

        <div className="button">
          <Button
            variant="contained"
            color="default"
            onClick={this.props.closePopup}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="default"
            onClick={this.confirmTransaction.bind(this)}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  }
}

const classes = (theme) => ({
  formControl: {
    margin: theme.spacing(10),
  },
});

export default withStyles(classes, { withTheme: true })(Popup);
