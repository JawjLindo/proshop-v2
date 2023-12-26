import { FunctionComponent, PropsWithChildren } from 'react';
import { Container } from 'react-bootstrap';

export const Body: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <main className='py-3'>
      <Container>{children}</Container>
    </main>
  );
};
