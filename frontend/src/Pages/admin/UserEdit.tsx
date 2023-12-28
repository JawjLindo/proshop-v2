import { Link, useNavigate, useParams } from 'react-router-dom';
import { Components } from '../../components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Types } from '../../types';
import { services } from '../../services';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { formatError } from '../../utils';

type EditUserFormValues = {
  name: string;
  email: string;
  isAdmin: boolean;
};

export const UserEdit = () => {
  const navigate = useNavigate();

  const { id: idParam } = useParams();
  if (idParam === null)
    return (
      <Components.Message variant='danger'>
        A user ID needs to be passed into the URL.
      </Components.Message>
    );
  const userId = idParam!;

  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<Types.User>({
    queryKey: ['user', userId],
    queryFn: () => services.users.getUserDetails(userId),
  });

  const { mutate: updateUser, isPending: loadingUpdate } = useMutation<
    Types.User,
    Error,
    Types.User
  >({
    mutationKey: ['user', userId],
    mutationFn: (user) => services.users.updateUser(user),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['user', userId] });
      toast.success('User updated');
      navigate('/admin/userlist');
    },
    onError: (error) => toast.error(formatError(error)),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormValues>();

  const onSubmit: SubmitHandler<EditUserFormValues> = (data) => {
    updateUser({
      _id: userId,
      name: data.name,
      email: data.email,
      isAdmin: data.isAdmin,
    });
  };

  const checkErrors = () => {
    if (errors.name) toast.error(errors.name.message);
    if (errors.email) toast.error(errors.email.message);
  };

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <Components.FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Components.Loader />}
        {isLoading ? (
          <Components.Loader />
        ) : error ? (
          <Components.Message variant='danger'>
            {error.message}
          </Components.Message>
        ) : (
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId='name' className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                defaultValue={user?.name}
                {...register('name', { required: 'The name is required.' })}
              />
            </Form.Group>
            <Form.Group controlId='email' className='my-2'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                defaultValue={user?.email}
                {...register('email', { required: 'The email is required.' })}
              />
            </Form.Group>
            <Form.Group controlId='isAdmin' className='my-2'>
              <Form.Check
                type='checkbox'
                className='my-2'
                label='Is Admin'
                defaultChecked={user?.isAdmin}
                {...register('isAdmin')}
              />
            </Form.Group>
            <Button
              type='submit'
              variant='primary'
              className='my-2'
              onClick={checkErrors}
            >
              Update
            </Button>
          </Form>
        )}
      </Components.FormContainer>
    </>
  );
};
