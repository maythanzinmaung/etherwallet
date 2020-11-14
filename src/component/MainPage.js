import React, { Component } from "react";
import { Link, Switch, BrowserRouter as Router, Route } from "react-router-dom";
import Web3 from "web3";
import { Admin } from "web3-eth-admin";
import Popup from "./PopUp";
import Swal from "sweetalert2";
import {
  Drawer,
  CssBaseline,
  withStyles,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
  Button,
} from "@material-ui/core";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import LoopIcon from "@material-ui/icons/Loop";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";

const drawerWidth = 240;
const pendingArr = [];
const pen = [];
const today=new Date();
const web3 = new Web3(
  new Web3.providers.HttpProvider("http://127.0.0.1:8545/")
);

// const admin = new Admin("http://127.0.0.1:8545/", null, options);
// const admin = new Admin("http://127.0.0.1:8545/");

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  logout: {
    position: "fixed",
    bottom: 0,
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(3),
  },
  mainPage: {
    alignItems: "center",
  },
  listItemText: {
    fontSize: "20px", //Insert your required size
  },
});

class PermanentDrawerLeft extends Component {
  constructor(props) {
    super(props);
    this.state = {
      acc: [],
      bal: "",
      currPending: [],
      open: false,
      showPopup: false,
      no: 0,
      currentPending: [],
      pending:
        localStorage.getItem("transactions") === null
          ? []
          : localStorage.getItem("transactions").split(","),

      tx: "",
      txAll: "",
      block: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.addAccount = this.addAccount.bind(this);
    this.indexNo = this.indexNo.bind(this);
    this.fetchBalance = this.fetchBalance.bind(this);
    this.loadBlockchain = this.loadBlockchain.bind(this);
    this.getReceipt = this.getReceipt.bind(this);
  }

  //passing index no of each list
  indexNo(index) {
    this.setState({
      no: index,
    });
    this.fetchBalance();
  }

  // popup
  popupToggle() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  //get each account's balance
  async fetchBalance() {
    const accounts = await web3.eth.getAccounts();
    const balInWei = await web3.eth.getBalance(accounts[this.state.no]);
    const balance = web3.utils.fromWei(balInWei, "ether");
    this.setState({ bal: balance });
  }

  //creating new account
   addAccount() {
    const hashresult= web3.utils.keccak256("maythanzinmaung")
    console.log(hashresult)
  //   Swal.fire({
  //     title: "Enter a Passphrase",
  //     input: "text",
  //     inputAttributes: {
  //       autocapitalize: "off",
  //     },
  //     confirmButtonText: "Create",
  //     showCancelButton: true,
  //     closeModal: false,
  //     showLoaderOnConfirm: true,
  //     preConfirm: (password) => {
  //       return web3.eth.personal.newAccount(password).then((response) => {
  //         console.log(response);
  //         return response;
  //       });
  //     },
  //     allowOutsideClick: () => !Swal.isLoading(),
  //   }).then((result) => {
  //     if (result.value) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "Success!!",
  //         text: `Your Address is "${result.value}"`,
  //         footer: "Please Remember Your Password!",
  //       });
  //     }
  //     console.log(result);
  //     this.setState({ acc: [...this.state.acc, result] });
  //   });
  console.log("start time "+today.getHours()+":"+today.getMinutes()+":"+today.getSeconds())
  }

  //adding peer nodes
  // addPeer() {
  //   localStorage.clear("transactions");
  //   // admin.addPeer
  // }

  async getReceipt(hash) {
    const currentacc = `${this.state.acc[this.state.no]}`.toLowerCase();
    console.log("this acc " + currentacc);
    console.log("no" + this.state.no);
    console.log(this.state.pending);
    await web3.eth.getTransaction(hash).then((res) => {
      console.log(res);
      const amount = web3.utils.fromWei(res.value, "ether");
      const gas = web3.utils.fromWei(res.gas.toString(), "ether");
      Swal.fire({
        title: "Transaction Details ",
        width: "600px",
        padding: "0em",
        html: `<div className="swal-body"> Sender : ${res.from}</div><br /><div>
        Receiver : ${res.to}<div><br />
        Block No : ${res.blockNumber}
         <div> Amount : ${amount} ether </div><br /><div>Gas Price : ${gas} ether</div>`,
      });
    });
  }

  //handle to expand or not account list
  handleClick() {
    this.setState({ open: !this.state.open });
  }

  //get accounts for account list
  async loadBlockchain() {
    const accounts = await web3.eth.getAccounts();
    const balInWei = await web3.eth.getBalance(accounts[this.state.no]);
    const balance = web3.utils.fromWei(balInWei, "ether");
    web3.eth.getPendingTransactions().then((result) => {
      if (result.length > 0) {
        pen.length = 0;
        pendingArr.length = 0;
        for (var i = 0; i < result.length; i++) {
          pendingArr.push(result[i].hash);
          pen.push(result[i].hash);
        }

        const update = [...new Set([...this.state.pending, ...pendingArr])];
        localStorage.setItem("transactions", update);
        this.setState({ pending: update, currentPending: pen });
        // this.setState({currPending:pen})
      } else {
        this.setState({ currentPending: [] });
      }
    });

    this.setState({ acc: accounts, bal: balance });
  }

  //lifecycle method
  componentDidMount() {
    this.loadBlockchain();
    setInterval(() => {
      this.loadBlockchain();
    }, 7000);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Ether Wallet
            </Typography>
          </Toolbar>
        </AppBar>
        <Router>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <div className={classes.toolbar} />
            <div></div>
            <Divider />

            <List>
              <ListItem button onClick={this.handleClick}>
                <ListItemIcon>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Accounts"
                />
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {this.state.acc.map((acc, index) => (
                    <ListItem
                      button
                      key={acc}
                      className={classes.nested}
                      component={Link}
                      to={"/details"}
                      onClick={() => this.indexNo(index)}
                    >
                      <ListItemIcon>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Account ${index + 1}`}
                        classes={{ primary: classes.listItemText }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
              <Divider />
              <ListItem button onClick={this.addAccount}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="New Account"
                />
              </ListItem>
            </List>

            <List className={classes.logout}>
              <Divider />
              <ListItem button component={Link} to="/sign-in">
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary="Log Out"
                />
              </ListItem>
            </List>
            <Divider />
          </Drawer>
          <main className={classes.content}>
            <div />
            <div
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingBlockEnd: 40,
              }}
            >
              <Switch>
                <Route
                  exact
                  path="/home"
                  render={() => (
                    <div>
                      <div style={{ position: "absolute", left: "45%" }}>
                        <h3>Account {this.state.no + 1}</h3>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          position: "absolute",
                          left: "35%",
                          top: "150px",
                          fontSize: "25px",
                        }}
                      >
                        <h5>"{this.state.acc[this.state.no]}"</h5>
                        <FileCopyOutlinedIcon />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          position: "absolute",
                          left: "43%",
                          top: "180px",
                        }}
                      >
                        <MonetizationOnIcon
                          style={{ position: "relative", left: 0 }}
                        />
                        <h5>{this.state.bal} ether</h5>
                        {/* <h5>1024.999979 ethers</h5> */}
                      </div>
                    </div>
                  )}
                />
                <Route
                  exact
                  path="/details"
                  render={() => (
                    <div>
                      <div style={{ position: "absolute", left: "45%" }}>
                        <h3>Account {this.state.no + 1}</h3>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          position: "absolute",
                          left: "35%",
                          top: "150px",
                          fontSize: "25px",
                        }}
                      >
                        <h5>"{this.state.acc[this.state.no]}"</h5>
                        <FileCopyOutlinedIcon />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          position: "absolute",
                          left: "43%",
                          top: "180px",
                        }}
                      >
                        <MonetizationOnIcon
                          style={{ position: "relative", left: 0 }}
                        />
                        <h5>{this.state.bal} ether</h5>
                      </div>
                    </div>
                  )}
                />
              </Switch>
            </div>

            <div />
            <div
              style={{
                position: "absolute",
                left: "45%",
                top: "30%",
                paddingBlockEnd: "50px",
              }}
            >
              <Button
                variant="contained"
                styles={{ flexGrow: 1 }}
                onClick={this.popupToggle.bind(this)}
              >
                Transfer
              </Button>
              {this.state.showPopup ? (
                <Popup
                  accountState={this.state.acc}
                  closePopup={this.popupToggle.bind(this)}
                  reload={this.loadBlockchain.bind(this)}
                />
              ) : null}
            </div>
            <div />
            <div />

            <div className="pending">
              <Divider />
              <label className="pendingheader">Transactions</label>
              {Object.keys(this.state.pending).length === 0 ? (
                <div className="pending-body"> No Transaction yet! </div>
              ) : (
                this.state.pending.map((value, index) => (
                  <div key={index} className="pending-body">
                    {value}
                    {this.state.currentPending.includes(value) ? (
                      <LoopIcon
                        style={{
                          position: "absolute",
                          fill: "#ef6c00",
                          right: "33%",
                        }}
                      />
                    ) : (
                      <CheckCircleOutlineIcon
                        style={{
                          position: "absolute",
                          fill: "#4caf50",
                          right: "33%",
                        }}
                      />
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      style={{ position: "absolute", right: "25%" }}
                      onClick={() => this.getReceipt(value)}
                    >
                      Detail
                    </Button>
                    <div style={{ marginBlockStart: 20 }}>
                      <Divider light variant="middle" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </Router>
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(PermanentDrawerLeft);
