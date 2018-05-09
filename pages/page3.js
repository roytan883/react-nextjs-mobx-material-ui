import React, { Component } from 'react'

import Link from 'next/link'
import Button from 'material-ui/Button';

import privatePage from '../utils/privatePage';

class Page3 extends Component {
  render() {
    return (
      <div>
        Welcome to Page3
      <br />
        <Link href={{ pathname: '/', query: { name: 'haha' } }}>
          <Button variant="raised" color="primary">
            Back
      </Button>
        </Link>
      </div>
    )
  }
}

export default privatePage(Page3);
// export default Page3