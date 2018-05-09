import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import withRoot from '../src/withRoot';

import Link from 'next/link'

import store from '../data/store'

const styles = theme => ({
  root: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit * 20,
  },
});

let __ON_SERVER__ = false

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
    if (!__ON_SERVER__) {
      console.log("constructor / page at Client")
      let serverStoreData = props.store
      store.init(false, serverStoreData.name, serverStoreData.age)
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
          <Button variant="raised" color="primary">
            页面2
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