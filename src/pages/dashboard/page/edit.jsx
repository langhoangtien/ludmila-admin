import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import PageEditView from './view/page-edit-vew';

// ----------------------------------------------------------------------

export default function EditPage() {
  const params = useParams();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Product Edit</title>
      </Helmet>

      <PageEditView id={`${id}`} />
    </>
  );
}
