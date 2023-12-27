import { useMutation } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { services } from '../services';
import { useAuthDispatch } from '../contexts';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Components } from '../components';
import { Button, Form } from 'react-bootstrap';
import { Types } from '../types';

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const Register = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const dispatch = useAuthDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const { mutate: registerUser, isPending } = useMutation<
    Types.User,
    Error,
    { name: string; email: string; password: string }
  >({
    mutationKey: ['register'],
    mutationFn: (data) => {
      return services.users.register(data.name, data.email, data.password);
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

  const onSubmit: SubmitHandler<RegisterFormValues> = (data) => {
    registerUser({
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
    <Components.FormContainer>
      <h1>Register</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter name'
            defaultValue=''
            {...register('name', { required: 'The name is required.' })}
          />
        </Form.Group>
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
          Register
        </Button>
      </Form>
    </Components.FormContainer>
  );
};
