import { useMutation, useQuery } from '@tanstack/react-query';
import { services } from '../../services';
import { Types } from '../../types';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Components } from '../../components';
import { formatCurrency } from '../../utils';
import { LinkContainer } from 'react-router-bootstrap';
import { AxiosError } from 'axios';
import { MouseEventHandler, useState } from 'react';

export const ProductList = () => {
  const [errorText, setErrorText] = useState<string | null>();

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Types.Product[]>({
    queryKey: ['products'],
    queryFn: () => services.products.getProducts(),
  });

  const { mutate: createProduct, isPending } = useMutation<Types.Product>({
    mutationKey: ['createProduct'],
    mutationFn: () => services.products.createProduct(),
    onSuccess: () => {
      refetch();
    },
    onError: () => {
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

  const deleteHandler = (_productId: string) => {};

  const createProductHandler: MouseEventHandler<HTMLButtonElement> = () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      createProduct();
    }
  };

  return (
    <>
      {errorText && (
        <Components.Message variant='danger'>{errorText}</Components.Message>
      )}
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-end'>
          <Button className='btn-sm m-3' onClick={createProductHandler}>
            <FaEdit /> Create Product
          </Button>
        </Col>
      </Row>
      {isLoading || isPending ? (
        <Components.Loader />
      ) : isError ? (
        <Components.Message variant='danger'>
          {error.message}
        </Components.Message>
      ) : (
        <>
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${formatCurrency(product.price)}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};
