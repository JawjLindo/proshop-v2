import { useMutation, useQuery } from '@tanstack/react-query';
import { services } from '../../services';
import { Types } from '../../types';
import { Components } from '../../components';
import { Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaCheck, FaEdit, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { formatError } from '../../utils';

export const UserList = () => {
  const {
    data: users,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Types.User[]>({
    queryKey: ['allUsers'],
    queryFn: () => services.users.getUsers(),
  });

  const { mutate: deleteUser, isPending: loadingDelete } = useMutation<
    { message: string },
    Error,
    string
  >({
    mutationKey: ['deleteUser'],
    mutationFn: (id) => services.users.deleteUser(id),
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
    onError: (error) => toast.error(formatError(error)),
  });

  const deleteHandler = (id: string) => {
    if (window.confirm('Are you sure?')) {
      deleteUser(id);
    }
  };

  return (
    <>
      <h1>Users</h1>
      {loadingDelete && <Components.Loader />}
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
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button className='btn-sm' variant='light'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(user._id)}
                  >
                    <FaTrash style={{ color: 'white' }} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};
