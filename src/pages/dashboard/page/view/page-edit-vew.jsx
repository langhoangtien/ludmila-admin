import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { getPage } from 'src/api/page';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EditForm from './page-new-edit-form';

// ----------------------------------------------------------------------

export default function PageEditView({ id }) {
  const settings = useSettingsContext();
  const [loading, setLoading] = useState(false);
  const [currentpage, setCurrentpage] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const responseData = await getPage(id);

        const pageData = responseData.data;

        setCurrentpage(pageData);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [id]);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'page',
            href: paths.dashboard.page.root,
          },
          { name: currentpage?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {loading ? <LoadingScreen /> : <EditForm current={currentpage} />}
    </Container>
  );
}

PageEditView.propTypes = {
  id: PropTypes.string,
};
