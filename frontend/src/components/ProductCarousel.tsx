import { useQuery } from '@tanstack/react-query';
import { Types } from '../types';
import { services } from '../services';
import { Loader } from './Loader';
import { Message } from './Message';
import { formatCurrency, formatError, formatImageUrl } from '../utils';
import { Carousel, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const ProductCarousel = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Types.Product[]>({
    queryKey: ['topProducts'],
    queryFn: () => services.products.getTopProducts(),
  });

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{formatError(error)}</Message>
  ) : (
    <>
      <Carousel pause='hover' className='bg-primary mb-4'>
        {products?.map((product) => (
          <Carousel.Item key={product._id}>
            <Link to={`/product/${product._id}`}>
              <Image
                src={formatImageUrl(product.image)}
                alt={product.name}
                fluid
              />
              <Carousel.Caption className='carousel-caption'>
                <h2>
                  {product.name} (${formatCurrency(product.price)})
                </h2>
              </Carousel.Caption>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};
