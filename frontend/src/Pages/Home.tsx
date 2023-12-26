import { Col, Row } from 'react-bootstrap';
import { Components } from '../components';
import { useQuery } from '@tanstack/react-query';
import { services } from '../services';
import { ProductType } from '../types/ProductType';

export const Home = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery<ProductType[]>({
    queryKey: ['products'],
    queryFn: () => services.products.getProducts(),
  });

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
          <h1>Latest Products</h1>
          <Row>
            {products?.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Components.Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};
