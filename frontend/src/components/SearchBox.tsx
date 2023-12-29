import { Button, Form } from 'react-bootstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

type SearchBoxValues = {
  keyword: string;
};

export const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const { register, handleSubmit, resetField } = useForm<SearchBoxValues>({
    defaultValues: { keyword: urlKeyword },
  });

  const onSubmit: SubmitHandler<SearchBoxValues> = (data) => {
    if (data.keyword.trim()) {
      resetField('keyword');
      navigate(`/search/${data.keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className='d-flex'>
      <Form.Control
        type='text'
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
        {...register('keyword')}
      />
      <Button type='submit' variant='outline-light' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  );
};
