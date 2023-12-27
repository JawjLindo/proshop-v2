import { Link, useNavigate, useParams } from 'react-router-dom';
import { Components } from '../../components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Types } from '../../types';
import { services } from '../../services';
import { AxiosError } from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { ChangeEvent, ChangeEventHandler, MouseEventHandler } from 'react';

type EditProductFormValues = {
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  countInStock: number;
  description: string;
};

export const ProductEdit = () => {
  const navigate = useNavigate();

  const { id: idParam } = useParams();
  if (idParam === null)
    return (
      <Components.Message variant='danger'>
        A product ID needs to be passed into the URL.
      </Components.Message>
    );
  const productId = idParam!;

  const queryClient = useQueryClient();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Types.Product>({
    queryKey: ['product', productId],
    queryFn: () => services.products.getProductById(productId),
  });

  const { mutate: updateProduct, isPending: loadingUpdate } = useMutation<
    Types.Product,
    AxiosError,
    Types.Product
  >({
    mutationKey: ['product', productId],
    mutationFn: (product) => services.products.updateProduct(product),
    onSuccess: () => {
      //queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.removeQueries({ queryKey: ['product', productId] });
      toast.success('Product updated');
      navigate('/admin/productlist');
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          ((error as AxiosError).response?.data as { message: string })
            .message || error.message
        );
      } else {
        toast.error((error as Error).message);
      }
    },
  });

  const { mutate: uploadProductImage, isPending: loadingUpload } = useMutation<
    { message: string; image: string },
    AxiosError,
    File
  >({
    mutationKey: ['uploadProduct', productId],
    mutationFn: (file) => services.products.uploadProductImage(file),
    onSuccess: (data) => {
      setValue('image', data.image);
      toast.success(data.message);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          ((error as AxiosError).response?.data as { message: string })
            .message || error.message
        );
      } else {
        toast.error((error as Error).message);
      }
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<EditProductFormValues>();

  const onSubmit: SubmitHandler<EditProductFormValues> = (data) => {
    updateProduct({
      _id: productId,
      brand: data.brand,
      category: data.category,
      countInStock: data.countInStock,
      description: data.description,
      name: data.name,
      price: data.price,
      image: data.image,
    });
  };

  const checkErrors = () => {
    if (errors.name) toast.error(errors.name.message);
    if (errors.brand) toast.error(errors.brand.message);
    if (errors.category) toast.error(errors.category.message);
    if (errors.countInStock) toast.error(errors.countInStock.message);
    if (errors.description) toast.error(errors.description.message);
    if (errors.price) toast.error(errors.price.message);
    if (errors.image) toast.error(errors.image.message);
  };

  const uploadFileHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    uploadProductImage(e.target.files?.item(0)!);
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <Components.FormContainer>
        <h1>Edit Product</h1>
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
                defaultValue={product?.name}
                {...register('name', { required: 'The name is required.' })}
              />
            </Form.Group>
            <Form.Group controlId='price' className='my-2'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                defaultValue={product?.price}
                step='0.01'
                {...register('price', { required: 'The price is required.' })}
              />
            </Form.Group>
            <Form.Group controlId='image' className='my-2'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image URL'
                defaultValue={product?.image}
                {...register('image', { required: 'The image is required.' })}
              />
              <Form.Control
                type='file'
                html-label='Choose file'
                onChange={uploadFileHandler}
              />
            </Form.Group>
            <Form.Group controlId='brand' className='my-2'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                defaultValue={product?.brand}
                {...register('brand', { required: 'The brand is required.' })}
              />
            </Form.Group>
            <Form.Group controlId='countInStock' className='my-2'>
              <Form.Label>Count in Stock</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter count in stock'
                defaultValue={product?.countInStock}
                {...register('countInStock', {
                  required: 'The count in stock is required.',
                })}
              />
            </Form.Group>
            <Form.Group controlId='category' className='my-2'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                defaultValue={product?.category}
                {...register('category', {
                  required: 'The category is required.',
                })}
              />
            </Form.Group>
            <Form.Group controlId='description' className='my-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                defaultValue={product?.description}
                {...register('description', {
                  required: 'The description is required.',
                })}
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
