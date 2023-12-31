import { FunctionComponent } from 'react';
import { Types } from '../types';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Rating } from './Rating';
import { formatImageUrl } from '../utils';

type ProductProps = {
  product: Types.Product;
};

export const Product: FunctionComponent<ProductProps> = ({ product }) => {
  return (
    <Card className='my-3 p-3 rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={formatImageUrl(product.image)} variant='top' />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div' className='product-title'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <Rating
            value={product.rating!}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as='h3'>${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};
