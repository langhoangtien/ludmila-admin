import { Helmet } from 'react-helmet-async';

import PageListView from './view/page-list-view';

// ----------------------------------------------------------------------

export default function ListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>

      <PageListView />
    </>
  );
}
