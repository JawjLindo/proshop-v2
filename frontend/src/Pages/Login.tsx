import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { services } from '../services';
import { useAuthDispatch, useAuthValue } from '../contexts';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Components } from '../components';
import { Types } from '../types';

type LoginFormValues = {
  email: string;
  password: string;
};

export const Login = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LoginFormValues>();

  const dispatch = useAuthDispatch();
  const { userInfo } = useAuthValue();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const { mutate: login, isPending } = useMutation<
    Types.User,
    Error,
    { email: string; password: string }
  >({
    mutationKey: ['login'],
    mutationFn: (data) => {
      return services.users.login(data.email, data.password);
    },
    onSuccess: (userInfo) => {
      dispatch({ type: 'auth/setCredentials', payload: userInfo });
      navigate(redirect);
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

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    login({ email: data.email, password: data.password });
  };

  const checkErrors = () => {
    if (errors.email) toast.error(errors.email.message);
    if (errors.password) toast.error(errors.password.message);
  };

  return (
    <Components.FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            defaultValue=''
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
            {...register('password', { required: 'The password is required.' })}
          />
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='mt-2'
          disabled={isPending}
          onClick={checkErrors}
        >
          Sign In
        </Button>
        {isPending && <Components.Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
          <Link to={`/register?redirect=${redirect}`}>New Customer?</Link>
        </Col>
      </Row>
    </Components.FormContainer>
  );
};
