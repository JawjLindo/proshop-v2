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
import { useMutation, useQuery } from '@tanstack/react-query';
import { services } from '../services';
import { MouseEventHandler, useId, useState } from 'react';
import { Types } from '../types';
import { formatError, formatImageUrl } from '../utils';
import { useAuth, useCart } from '../stores';
import { toast } from 'react-toastify';
import { SubmitHandler, useForm } from 'react-hook-form';

type ReviewFormValues = {
  rating: number;
  comment: string;
};

export const Product = () => {
  const navigate = useNavigate();
  const reviewId = useId();

  const { id: idParam } = useParams();
  if (idParam === null)
    return (
      <Components.Message variant='danger'>
        A product ID needs to be passed into the URL.
      </Components.Message>
    );
  const productId = idParam!;

  const [qty, setQty] = useState<number>(1);

  const userInfo = useAuth((state) => state.userInfo);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm<ReviewFormValues>({ defaultValues: { comment: '', rating: 0 } });

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Types.Product>({
    queryKey: ['product', productId],
    queryFn: () => services.products.getProductById(productId),
  });

  const { mutate: createReview, isPending: loadingProductReview } = useMutation<
    Types.Product,
    Error,
    { rating: number; comment: string }
  >({
    mutationKey: ['createReview', productId],
    mutationFn: (data) =>
      services.products.createReview(productId, data.rating, data.comment),
    onSuccess: () => {
      refetch();
      toast.success('Review submitted');
      reset();
    },
    onError: (error) => toast.error(formatError(error)),
  });

  const addItemToCart = useCart((state) => state.addItem);

  const addToCartHandler: MouseEventHandler<HTMLButtonElement> = () => {
    if (product) {
      addItemToCart({ ...product, qty });
      navigate('/cart');
    }
  };

  const onSubmit: SubmitHandler<ReviewFormValues> = (data) => {
    createReview({ rating: data.rating, comment: data.comment });
  };

  const checkErrors = () => {
    if (formErrors.rating) toast.error(formErrors.rating.message);
    if (formErrors.comment) toast.error(formErrors.comment.message);
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
          <Components.Meta title={product?.name} />
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
          <Row className='review'>
            <Col md={6}>
              <h2>Reviews</h2>
              {product?.reviews?.length === 0 && (
                <Components.Message>No Reviews</Components.Message>
              )}
              <ListGroup variant='flush'>
                {product?.reviews?.map((review) => (
                  <ListGroup.Item key={`${reviewId}-${userInfo?._id}`}>
                    <strong>{review.name}</strong>
                    <Components.Rating value={review.rating} />
                    <p>{review.createdAt?.toString().substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Review</h2>
                  {loadingProductReview && <Components.Loader />}
                  {userInfo ? (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <Form.Group controlId='rating' className='my-2'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          {...register('rating', {
                            min: {
                              value: 1,
                              message: 'You must select a rating.s',
                            },
                          })}
                          defaultValue={'0'}
                        >
                          <option value='0'>Select...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment' className='my-2'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          {...register('comment', {
                            required:
                              'Please fill in the comment of the review.',
                          })}
                        />
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type='submit'
                        variant='primary'
                        onClick={checkErrors}
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Components.Message>
                      Please <Link to='/login'>sign in</Link> to write a review
                    </Components.Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
