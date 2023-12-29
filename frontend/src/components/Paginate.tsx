import { FunctionComponent } from 'react';
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

type PaginateProps = {
  page: number;
  pages: number;
  pageUrl: string;
  keyword?: string;
};

export const Paginate: FunctionComponent<PaginateProps> = ({
  page,
  pages,
  pageUrl,
  keyword,
}) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            to={
              keyword
                ? `/search/${keyword}${pageUrl}/${x + 1}`
                : `${pageUrl}/${x + 1}`
            }
          >
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};
