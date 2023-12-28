import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { Components } from '../components';
import { useQuery } from '@tanstack/react-query';
import { services } from '../services';
import { MouseEventHandler, useState } from 'react';
import { Types } from '../types';
import { formatImageUrl } from '../utils';
import { useCart } from '../stores';

export const Product = () => {
  const navigate = useNavigate();

  const { id: idParam } = useParams();
  if (idParam === null)
    return (
      <Components.Message variant='danger'>
        A product ID needs to be passed into the URL.
      </Components.Message>
    );
  const productId = idParam!;

  const [qty, setQty] = useState<number>(1);

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery<Types.Product>({
    queryKey: ['product', productId],
    queryFn: () => services.products.getProductById(productId),
  });

  const addItemToCart = useCart((state) => state.addItem);

  const addToCartHandler: MouseEventHandler<HTMLButtonElement> = () => {
    if (product) {
      addItemToCart({ ...product, qty });
      navigate('/cart');
    }
  };

  return (
    <>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Components.Loader />
      ) : isError ? (
        <Components.Message variant='danger'>
          {error.message}
        </Components.Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              <Image
                src={formatImageUrl(product?.image)}
                alt={product?.name}
                fluid
              />
            </Col>
            <Col md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product?.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Components.Rating
                    value={product?.rating!}
                    text={`${product?.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
                <ListGroup.Item>{product?.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product?.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product?.countInStock! > 0
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product?.countInStock! > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product?.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>{' '}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className='btn-block'
                      type='button'
                      disabled={product?.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
