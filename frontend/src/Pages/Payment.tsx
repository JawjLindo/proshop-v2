import { SubmitHandler, useForm } from 'react-hook-form';
import { Components } from '../components';
import { Button, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCart } from '../stores';

type PaymentFormValues = {
  paymentMethod: string;
};

export const Payment = () => {
  const navigate = useNavigate();

  const shippingAddress = useCart((state) => state.shippingAddress);
  const paymentMethod = useCart((state) => state.paymentMethod);
  const updatePaymentMethod = useCart((state) => state.updatePaymentMethod);

  const { handleSubmit, register } = useForm<PaymentFormValues>();

  const onSubmit: SubmitHandler<PaymentFormValues> = (data) => {
    updatePaymentMethod(data.paymentMethod);
    navigate('/placeorder');
  };

  useEffect(() => {
    if (!shippingAddress) navigate('/shipping');
  }, [shippingAddress, navigate]);

  return (
    <Components.FormContainer>
      <Components.CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check
              type='radio'
              className='my-2'
              label='PayPal or Credit Card'
              checked={paymentMethod === 'PayPal'}
              value='PayPal'
              {...register('paymentMethod')}
            />
          </Col>
        </Form.Group>
        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </Components.FormContainer>
  );
};
