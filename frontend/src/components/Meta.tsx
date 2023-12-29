import { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet-async';

type MetaProps = {
  title?: string;
  description?: string;
  keywords?: string;
};

export const Meta: FunctionComponent<MetaProps> = ({
  title = 'Welcome to ProShop',
  description = 'We sell the best products for cheap',
  keywords = 'electronics, buy electronics, cheap electronics',
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};
