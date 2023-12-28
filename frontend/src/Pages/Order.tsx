import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { services } from '../services';
import { Components } from '../components';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { formatCurrency, formatError, formatImageUrl } from '../utils';
import {
  PayPalButtons,
  SCRIPT_LOADING_STATE,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import { MouseEventHandler, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Types } from '../types';
import { useAuth } from '../stores';

export const Order = () => {
  const { id: idParam } = useParams();
  if (idParam === null)
    return (
      <Components.Message variant='danger'>
        An order ID needs to be passed into the URL.
      </Components.Message>
    );
  const orderId = idParam!;

  const userInfo = useAuth((state) => state.userInfo);

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Types.Order>({
    queryKey: ['order', orderId],
    queryFn: () => services.orders.getOrderDetails(orderId),
  });

  const {
    data: paypalClientId,
    isLoading: loadingPaypal,
    error: errorPaypal,
  } = useQuery<string>({
    queryKey: ['paypalClientId'],
    queryFn: () => services.orders.getPaypalClientId(),
  });

  const { mutate: payOrder, isPending: loadingPay } = useMutation<
    void,
    Error,
    Types.Order
  >({
    mutationKey: ['payorder', orderId],
    mutationFn: (details) => services.orders.payOrder(orderId, { ...details }),
    onSuccess: () => {
      refetch();
      toast.success('Payment successful');
    },
    onError: (error) => toast.error(formatError(error)),
  });

  const { mutate: deliverOrder, isPending: loadingDeliver } = useMutation<
    void,
    Error,
    string
  >({
    mutationKey: ['deliverOrder', orderId],
    mutationFn: (orderId) => services.orders.deliverOrder(orderId),
    onSuccess: () => {
      refetch();
      toast.success('Order delivered');
    },
    onError: (error) => toast.error(formatError(error)),
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  useEffect(() => {
    if (!errorPaypal && !loadingPaypal && paypalClientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: { clientId: paypalClientId, currency: 'USD' },
        });
        paypalDispatch({
          type: 'setLoadingStatus',
          value: SCRIPT_LOADING_STATE.PENDING,
        });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPaypal, loadingPaypal, paypalClientId, paypalDispatch, order]);

  // const onApproveTest: MouseEventHandler<HTMLButtonElement> = () => {
  //   payOrder({ payer: {} });
  // };

  const deliverOrderHandler: MouseEventHandler<HTMLButtonElement> = () => {
    deliverOrder(orderId);
  };

  const createOrder: (data: any, actions: any) => Promise<string> = (
    _data,
    actions
  ) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: Number(formatCurrency(order?.totalPrice)),
            },
          },
        ],
      })
      .then((orderId: string) => orderId);
  };

  const onApprove: (data: any, actions: any) => Promise<void> = (
    _data,
    actions
  ) => {
    return actions.order!.capture().then(async (details: any) => {
      payOrder(details);
    });
  };

  const onError = (error: any) => {
    toast.error(error.message);
  };

  return (
    <>
      {isLoading ? (
        <Components.Loader />
      ) : isError ? (
        <Components.Message variant='danger'>
          {error.message}
        </Components.Message>
      ) : (
        <>
          <h1>Order {order?._id}</h1>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong>
                    {order?.user?.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {order?.user?.email}
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {order?.shippingAddress.address},{' '}
                    {order?.shippingAddress.city}{' '}
                    {order?.shippingAddress.postalCode},{' '}
                    {order?.shippingAddress.country}
                  </p>
                  {order?.isDelivered ? (
                    <Components.Message variant='success'>
                      Delivered on {order.deliveredAt?.toString()}
                    </Components.Message>
                  ) : (
                    <Components.Message variant='danger'>
                      Not delivered
                    </Components.Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order?.paymentMethod}
                  </p>
                  {order?.isPaid ? (
                    <Components.Message variant='success'>
                      Paid on {order.paidAt?.toString()}
                    </Components.Message>
                  ) : (
                    <Components.Message variant='danger'>
                      Not paid
                    </Components.Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order?.orderItems.map((item, index) => (
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
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {formatCurrency(item.qty)} x $
                          {formatCurrency(item.price)} = $
                          {formatCurrency(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
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
                      <Col>Items</Col>
                      <Col>${formatCurrency(order?.itemsPrice)}</Col>
                    </Row>
                    <Row>
                      <Col>Shipping</Col>
                      <Col>${formatCurrency(order?.shippingPrice)}</Col>
                    </Row>
                    <Row>
                      <Col>Tax</Col>
                      <Col>${formatCurrency(order?.taxPrice)}</Col>
                    </Row>
                    <Row>
                      <Col>Total</Col>
                      <Col>${formatCurrency(order?.totalPrice)}</Col>
                    </Row>
                  </ListGroup.Item>
                  {!order?.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Components.Loader />}
                      {isPending ? (
                        <Components.Loader />
                      ) : (
                        <div>
                          {/* <Button
                            onClick={onApproveTest}
                            style={{ marginBottom: '10px' }}
                          >
                            Test Pay Order
                          </Button> */}
                          <div>
                            <PayPalButtons
                              createOrder={createOrder}
                              onApprove={onApprove}
                              onError={onError}
                            />
                          </div>
                        </div>
                      )}
                    </ListGroup.Item>
                  )}
                  {loadingDeliver && <Components.Loader />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order?.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        <Button
                          type='button'
                          className='btn btn-block'
                          onClick={deliverOrderHandler}
                        >
                          Mark as Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
