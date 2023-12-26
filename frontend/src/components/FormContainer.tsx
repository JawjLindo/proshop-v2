import { FunctionComponent, PropsWithChildren } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

export const FormContainer: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};
