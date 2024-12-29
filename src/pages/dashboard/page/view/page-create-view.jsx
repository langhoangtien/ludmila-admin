import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import EditForm from './page-new-edit-form';

// ----------------------------------------------------------------------

export default function PageCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new page"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Page',
            href: paths.dashboard.page.root,
          },
          { name: 'New page' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <EditForm />
    </Container>
  );
}
