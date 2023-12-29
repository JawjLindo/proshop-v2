import { useMutation, useQuery } from '@tanstack/react-query';
import { GetProductsType, services } from '../../services';
import { Types } from '../../types';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Components } from '../../components';
import { formatCurrency, formatError } from '../../utils';
import { LinkContainer } from 'react-router-bootstrap';
import { MouseEventHandler, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

export const ProductList = () => {
  const { pageNumber: pageNumberParam, keyword } = useParams();
  const pageNumber = pageNumberParam ? Number(pageNumberParam) : 1;

  const [errorText, setErrorText] = useState<string | null>();

  const {
    data: productData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<GetProductsType>({
    queryKey: ['products', pageNumber, keyword],
    queryFn: () => services.products.getProducts(pageNumber, keyword),
  });

  const { mutate: createProduct, isPending: loadingCreate } =
    useMutation<Types.Product>({
      mutationKey: ['createProduct'],
      mutationFn: () => services.products.createProduct(),
      onSuccess: () => {
        refetch();
      },
      onError: (error) => setErrorText(formatError(error)),
    });

  const { mutate: deleteProduct, isPending: loadingDelete } = useMutation<
    { message: string },
    Error,
    string
  >({
    mutationKey: ['deleteProduct'],
    mutationFn: (productId) => services.products.deleteProduct(productId),
    onSuccess: () => {
      toast.success('Product deleted');
      refetch();
    },
    onError: (error) => setErrorText(formatError(error)),
  });

  const deleteHandler = (productId: string) => {
    if (window.confirm('Are you sure?')) {
      deleteProduct(productId);
    }
  };

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
      {(loadingCreate || loadingDelete) && <Components.Loader />}
      {isLoading ? (
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
              {productData?.products?.map((product) => (
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
          <Components.Paginate
            pages={productData?.pages!}
            page={pageNumber}
            pageUrl='/admin/productlist'
            keyword={keyword}
          />
        </>
      )}
    </>
  );
};
