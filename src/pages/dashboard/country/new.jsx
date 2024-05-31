import { Helmet } from 'react-helmet-async';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function CategoryCreatePage() {
  const settings = useSettingsContext();
  const params = useParams();
  const { id } = params;
  console.log(id);
  return (
    <>
      <Helmet>
        <title> Dashboard: Category Edit</title>
      </Helmet>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new category"
          links={[
            {
              name: 'Dashboard',
              href: paths.dashboard.root,
            },
            {
              name: 'Category',
              href: paths.dashboard.category.root,
            },
            { name: 'New category' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
      </Container>
    </>
  );
}
