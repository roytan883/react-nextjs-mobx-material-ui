import React from 'react';
import PropTypes from 'prop-types';
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../utils/withRoot';

import Link from 'next/link'

import store from '../data/store'

import Switch from 'material-ui/Switch';

// import Router from 'next/router'

// Router.beforePopState(({ url, asPath, options }) => {
//   // I only want to allow these two routes!
//   if (asPath != "/" && store.isAuth != true) {
//     // Have SSR render bad routes as a 404.
//     // window.location.href = as
//     return false
//   }

//   return true
// });

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

let _isServer = false

@observer
class Index extends React.Component {

  static async getInitialProps({ req }) {
    _isServer = !!req
    console.log(`Index page: getInitialProps isServer[${_isServer}]`)
    if (_isServer) {
      await store.init(true)
    }
    return { store }
  }

  constructor(props) {
    super(props)
    console.log("Index page: constructor isServer = ", _isServer)
    if (!_isServer && !store.clientInited) {
      console.log("Index page: constructor at Client, init store")
      let storeData = props.store
      store.init(false, storeData)
      store.delayAdd(3)
      store.startClock()
    }
  }

  state = {
    open: false,
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleClick = () => {
    this.setState({
      open: true,
    });
  };

  render() {
    console.log("index render() store.isAuth = ", store.isAuth)
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div className={classes.root}>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle>Super Secret Password</DialogTitle>
          <DialogContent>
            <DialogContentText>1-2-3-4-5</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Typography variant="display1" gutterBottom>
          Material-UI
        </Typography>
        <Typography variant="subheading" gutterBottom>
          example project
        </Typography>
        <Typography variant="subheading" gutterBottom>
          isServer = {"" + store.isServer} name = {"" + store.name} age = {"" + store.age}
        </Typography>
        <Button variant="raised" color="secondary" onClick={this.handleClick}>
          Open Dialog
        </Button>
        <br />
        Now = {store.now}
        <br />
        <Link href={{ pathname: '/page2', query: { name: 'Zeit' } }}>
          <Button variant="raised" color={store.age > 17 ? "secondary" : "primary"}>
            页面2 age={"" + store.age}
          </Button>
        </Link>
        <br />
        Auth =<Switch
          checked={store.isAuth}
          onClick={(event, checked) => {
            store.isAuth = !store.isAuth
          }}
          value="checkedB"
          color="primary"
        />
        <br />
        <Link href={{ pathname: '/page3', query: { name: 'Zeit' } }}>
          <Button variant="raised" color="primary">
            仅Auth状态才能跳转的页面Page3
          </Button>
        </Link>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(Index));