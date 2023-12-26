import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuthDispatch, useAuthValue } from '../contexts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { services } from '../services';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Loader } from '../components/Loader';
import { Components } from '../components';
import { formatCurrency } from '../utils';
import { FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { Types } from '../types';

type UpdateProfileFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const Profile = () => {
  const { userInfo } = useAuthValue();
  const dispatch = useAuthDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>();

  const { mutate: updateProfile, isPending } = useMutation({
    mutationKey: ['updateProfile', userInfo!._id],
    mutationFn: (data: { name: string; email: string; password: string }) =>
      services.users.updateProfile(
        userInfo!._id,
        data.name,
        data.email,
        data.password
      ),
    onSuccess: (userInfo) => {
      dispatch({ type: 'auth/setCredentials', payload: userInfo });
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          ((error as AxiosError).response?.data as { message: string })
            .message || error.message
        );
      } else {
        toast.error((error as Error).message);
      }
    },
  });

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery<Types.Order[]>({
    queryKey: ['orders', 'mine', userInfo?._id],
    queryFn: () => services.orders.getMyOrders(),
  });

  const onSubmit: SubmitHandler<UpdateProfileFormValues> = (data) => {
    updateProfile({
      name: data.name,
      email: data.email,
      password: data.password,
    });
  };

  const checkErrors = () => {
    if (errors.name) toast.error(errors.name.message);
    if (errors.email) toast.error(errors.email.message);
    if (errors.password) toast.error(errors.password.message);
    if (errors.confirmPassword) toast.error('The password fields do not match');
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId='name' className='my-2'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter name'
              defaultValue={userInfo!.name}
              {...register('name', { required: 'The name is required.' })}
            />
          </Form.Group>
          <Form.Group controlId='email' className='my-3'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              defaultValue={userInfo!.email}
              {...register('email', {
                required: 'The email address is required.',
              })}
            />
          </Form.Group>
          <Form.Group controlId='password' className='my-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter password'
              defaultValue=''
              {...register('password', {
                required: 'The password is required.',
              })}
            />
          </Form.Group>
          <Form.Group controlId='confirmPassword' className='my-3'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              defaultValue=''
              {...register('confirmPassword', {
                validate: (value, formValues) => value === formValues.password,
              })}
            />
          </Form.Group>
          <Button
            type='submit'
            variant='primary'
            className='mt-2'
            disabled={isPending}
            onClick={checkErrors}
          >
            Update
          </Button>
          {isLoading && <Loader />}
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <Components.Loader />
        ) : error ? (
          <Components.Message variant='danger'>
            {error?.message}
          </Components.Message>
        ) : (
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
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
                  <td>{order.createdAt.toString().substring(0, 10)}</td>
                  <td>${formatCurrency(order.totalPrice)}</td>
                  <td>
                    {order.isPaid ? (
                      order.createdAt.toString().substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
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
      </Col>
    </Row>
  );
};
