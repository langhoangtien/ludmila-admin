import { Helmet } from 'react-helmet-async';

import PageCreateView from './view/page-create-view';

// ----------------------------------------------------------------------

export default function CreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Create a new product</title>
      </Helmet>

      <PageCreateView />
    </>
  );
}
