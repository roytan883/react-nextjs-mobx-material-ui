import Link from 'next/link'
import Button from 'material-ui/Button';

export default () =>
  <div>
    Welcome to Page2
    <br />
    <Link href={{ pathname: '/', query: { name: 'haha' } }}>
      <Button variant="raised" color="primary">
        Back
      </Button>
    </Link>
  </div>