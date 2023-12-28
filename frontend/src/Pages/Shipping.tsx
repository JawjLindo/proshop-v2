import { Button, Form } from 'react-bootstrap';
import { Components } from '../components';
import { SubmitHandler, useForm } from 'react-hook-form';
// import { useCartDispatch, useCartValue } from '../contexts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../stores';

type ShippingFormValues = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

export const Shipping = () => {
  const navigate = useNavigate();

  const shippingAddress = useCart((state) => state.shippingAddress);
  const updateShippingAddress = useCart((state) => state.updateShippingAddress);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormValues>();

  const onSubmit: SubmitHandler<ShippingFormValues> = (data) => {
    updateShippingAddress({
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      country: data.country,
    });
    navigate('/payment');
  };

  const checkErrors = () => {
    if (errors.address) toast.error(errors.address.message);
    if (errors.city) toast.error(errors.city.message);
    if (errors.postalCode) toast.error(errors.postalCode.message);
    if (errors.country) toast.error(errors.country.message);
  };

  return (
    <Components.FormContainer>
      <Components.CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId='address' className='my-2'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter address'
            defaultValue={shippingAddress?.address || ''}
            {...register('address', { required: 'The address is required.' })}
          />
        </Form.Group>
        <Form.Group controlId='city' className='my-2'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter city'
            defaultValue={shippingAddress?.city || ''}
            {...register('city', { required: 'The city is required.' })}
          />
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-2'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter postal code'
            defaultValue={shippingAddress?.postalCode || ''}
            {...register('postalCode', {
              required: 'The postal code is required.',
            })}
          />
        </Form.Group>
        <Form.Group controlId='country' className='my-2'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter country'
            defaultValue={shippingAddress?.country || ''}
            {...register('country', { required: 'The country is required.' })}
          />
        </Form.Group>
        <Button
          type='submit'
          variant='primary'
          className='my-2'
          onClick={checkErrors}
        >
          Continue
        </Button>
      </Form>
    </Components.FormContainer>
  );
};
