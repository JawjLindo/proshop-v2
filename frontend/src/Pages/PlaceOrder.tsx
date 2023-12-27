import { useEffect, useState } from 'react';
import { useCartDispatch, useCartValue } from '../contexts';
import { Link, useNavigate } from 'react-router-dom';
import { CheckoutSteps } from '../components/CheckoutSteps';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { Components } from '../components';
import { formatCurrency, formatImageUrl } from '../utils';
import { useMutation } from '@tanstack/react-query';
import { Types } from '../types';
import { services } from '../services';
import { AxiosError } from 'axios';

export const PlaceOrder = () => {
  const navigate = useNavigate();

  const [errorText, setErrorText] = useState<string | null>();

  const cartDispatch = useCartDispatch();
  const cart = useCartValue();

  useEffect(() => {
    if (!cart.shippingAddress) navigate('/shipping');
    if (!cart.paymentMethod) navigate('/payment');
  }, [cart.paymentMethod, cart.shippingAddress, navigate]);

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
      cartDispatch({ type: 'cart/clearItems' });
      navigate(`/order/${order._id}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setErrorText(
          ((error as AxiosError).response?.data as { message: string })
            .message || error.message
        );
      } else {
        setErrorText((error as Error).message);
      }
    },
  });

  const placeOrderHandler = () => {
    const orderItems: Types.OrderItem[] = cart.cartItems.map((cartItem) => {
      return {
        _id: '',
        image: cartItem.image,
        name: cartItem.name,
        price: cartItem.price,
        product: cartItem._id,
        qty: cartItem.qty,
      };
    });

    createOrder({
      itemsPrice: cart.itemsPrice,
      orderItems,
      paymentMethod: cart.paymentMethod,
      shippingAddress: cart.shippingAddress!,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.taxPrice,
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
                {cart.shippingAddress?.address}, {cart.shippingAddress?.city}{' '}
                {cart.shippingAddress?.postalCode},{' '}
                {cart.shippingAddress?.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Components.Message>Your cart is empty</Components.Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
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
                  <Col>${formatCurrency(cart.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${formatCurrency(cart.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${formatCurrency(cart.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${formatCurrency(cart.totalPrice)}</Col>
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
                  disabled={cart.cartItems.length === 0}
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
