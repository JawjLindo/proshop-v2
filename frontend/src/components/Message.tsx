import { FunctionComponent, PropsWithChildren } from 'react';
import { Alert } from 'react-bootstrap';

type MessageProps = {
  variant?: 'success' | 'info' | 'danger';
};

export const Message: FunctionComponent<PropsWithChildren<MessageProps>> = ({
  variant = 'info',
  children,
}) => {
  return <Alert variant={variant}>{children}</Alert>;
};
