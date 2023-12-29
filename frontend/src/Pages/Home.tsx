import { Col, Row } from 'react-bootstrap';
import { Components } from '../components';
import { useQuery } from '@tanstack/react-query';
import { GetProductsType, services } from '../services';
import { Link, useParams } from 'react-router-dom';

export const Home = () => {
  const { pageNumber: pageNumberParam, keyword } = useParams();
  const pageNumber = pageNumberParam ? Number(pageNumberParam) : 1;

  const {
    data: productData,
    isLoading,
    isError,
    error,
  } = useQuery<GetProductsType>({
    queryKey: ['products', pageNumber, keyword],
    queryFn: () => services.products.getProducts(pageNumber, keyword),
  });

  return (
    <>
      {!keyword ? (
        <Components.ProductCarousel />
      ) : (
        <Link to='/' className='btn btn-light mb-4'>
          Go Back
        </Link>
      )}
      {isLoading ? (
        <Components.Loader />
      ) : isError ? (
        <Components.Message variant='danger'>
          {error.message}
        </Components.Message>
      ) : (
        <>
          <Components.Meta />
          <h1>Latest Products</h1>
          <Row>
            {productData?.products?.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Components.Product product={product} />
              </Col>
            ))}
          </Row>
          <Components.Paginate
            pages={productData?.pages!}
            page={pageNumber}
            pageUrl='/page'
            keyword={keyword}
          />
        </>
      )}
    </>
  );
};
