import { useQuery } from '@tanstack/react-query';
import { services } from '../../services';
import { Types } from '../../types';
import { Components } from '../../components';
import { Button, Table } from 'react-bootstrap';
import { formatCurrency } from '../../utils';
import { FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';

export const OrderList = () => {
  const {
    data: orders,
    isLoading,
    isError,
    error,
  } = useQuery<Types.Order[]>({
    queryKey: ['allOrders'],
    queryFn: () => services.orders.getOrders(),
  });

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Components.Loader />
      ) : isError ? (
        <Components.Message variant='danger'>
          {error.message}
        </Components.Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>{order.createdAt.toString().substring(0, 10)}</td>
                <td>${formatCurrency(order.totalPrice)}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.toString().substring(0, 10)
                  ) : (
                    <FaTimes />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.toString().substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className='btn-sm' variant='light'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
