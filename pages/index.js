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

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

let __ON_SERVER__ = false

@observer
class Index extends React.Component {

  static async getInitialProps({ req }) {
    __ON_SERVER__ = !!req
    console.log("First / page getInitialProps __ON_SERVER__ = ", __ON_SERVER__)
    store.init(__ON_SERVER__, "MyName", 16)
    return { store }
  }

  constructor(props) {
    super(props)
    console.log("constructor / page __ON_SERVER__ = ", __ON_SERVER__)
    if (!__ON_SERVER__ && store.clientInitTime == 0) {
      console.log("constructor / page at Client")
      let serverStoreData = props.store
      store.init(false, serverStoreData.name, serverStoreData.age)
      // store.setAuth()
      store.delayAdd(3)
      console.log("constructor / store.isAuth = ", store.isAuth)
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
          Super Secret Password
        </Button>
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