import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckoutSteps } from '../components/CheckoutSteps';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Components } from '../components';
import { formatCurrency, formatError, formatImageUrl } from '../utils';
import { useMutation } from '@tanstack/react-query';
import { Types } from '../types';
import { services } from '../services';
import { useCart } from '../stores';

export const PlaceOrder = () => {
  const navigate = useNavigate();

  const [errorText, setErrorText] = useState<string | null>();

  const cartItems = useCart((state) => state.cartItems);
  const shippingAddress = useCart((state) => state.shippingAddress);
  const itemsPrice = useCart((state) => state.itemsPrice);
  const paymentMethod = useCart((state) => state.paymentMethod);
  const shippingPrice = useCart((state) => state.shippingPrice);
  const taxPrice = useCart((state) => state.taxPrice);
  const totalPrice = useCart((state) => state.totalPrice);
  const clearCartItems = useCart((state) => state.clearItems);

  useEffect(() => {
    if (!shippingAddress) navigate('/shipping');
    if (!paymentMethod) navigate('/payment');
  }, [paymentMethod, shippingAddress, navigate]);

  const { mutate: createOrder, isPending } = useMutation<
    Types.Order,
    Error,
    Types.Order
  >({
    mutationKey: ['createOrder'],
    mutationFn: (order) => {
      return services.orders.createOrder(order);
    },
    onSuccess: (order) => {
      clearCartItems();
      navigate(`/order/${order._id}`);
    },
    onError: (error) => setErrorText(formatError(error)),
  });

  const placeOrderHandler = () => {
    const orderItems: Types.OrderItem[] = cartItems.map((cartItem) => {
      return {
        _id: cartItem._id,
        image: cartItem.image,
        name: cartItem.name,
        price: cartItem.price,
        product: cartItem._id,
        qty: cartItem.qty,
      };
    });

    createOrder({
      itemsPrice,
      orderItems,
      paymentMethod,
      shippingAddress: shippingAddress!,
      shippingPrice,
      taxPrice,
      totalPrice,
    });
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address: </strong>
                {shippingAddress?.address}, {shippingAddress?.city}{' '}
                {shippingAddress?.postalCode}, {shippingAddress?.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Components.Message>Your cart is empty</Components.Message>
              ) : (
                <ListGroup variant='flush'>
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={formatImageUrl(item.image)}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${formatCurrency(item.price)} = $
                          {formatCurrency(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${formatCurrency(itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${formatCurrency(shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${formatCurrency(taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${formatCurrency(totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {errorText && (
                  <Components.Message variant='danger'>
                    {errorText}
                  </Components.Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
                {isPending && <Components.Loader />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};
