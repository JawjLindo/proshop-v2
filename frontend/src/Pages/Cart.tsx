import { FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
// import { CartItem, useCartDispatch, useCartValue } from '../contexts';
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { Components } from '../components';
import { formatCurrency, formatImageUrl } from '../utils';
import { CartItem, useCart } from '../stores';

export const Cart = () => {
  const navigate = useNavigate();

  const cartItems = useCart((state) => state.cartItems);
  const itemsPrice = useCart((state) => state.itemsPrice);
  const addItemToCart = useCart((state) => state.addItem);
  const removeItemFromCart = useCart((state) => state.removeItem);

  const addToCartHandler: (item: CartItem, qty: number) => void = (
    item,
    qty
  ) => {
    addItemToCart({ ...item, qty });
  };

  const removeFromCartHandler: (id: string) => void = (id) => {
    removeItemFromCart(id);
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Components.Message>
            Your cart is empty <Link to='/'>Go Back</Link>
          </Components.Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image
                      src={formatImageUrl(item.image)}
                      alt={item.name}
                      fluid
                      rounded
                    />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as='select'
                      value={item.qty}
                      onChange={(e) => {
                        addToCartHandler(item, Number(e.target.value));
                      }}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}) items
              </h2>
              ${formatCurrency(itemsPrice)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};
