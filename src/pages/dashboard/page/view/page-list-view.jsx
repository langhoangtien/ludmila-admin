import { Card, Link, Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';
import ApiTable from 'src/components/api-table/api-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'name', label: 'Tên', align: 'left', search: true },
  { id: 'slug', label: 'URL', align: 'left', search: true },
  { id: 'createdAt', label: 'Ngày tạo', align: 'left' },
  { id: 'updatedAt', label: 'Cập nhật ', align: 'left' },
];

export default function PageListView() {
  const settings = useSettingsContext();

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Page',
            href: paths.dashboard.page.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.page.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Thêm mới
          </Button>
        }
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />

      <Card
        sx={{
          // height: { xs: 800, md: 2000 },
          flexGrow: { md: 1 },
          display: { md: 'flex' },
          flexDirection: { md: 'column' },
        }}
      >
        <ApiTable
          tableHead={TABLE_HEAD}
          apiURL={endpoints.page.list}
          mapFunction={(page) => ({
            ...page,
            name: (
              <Link
                href={`${page._id}/edit`}
                component={RouterLink}
                sx={{ textDecoration: 'none', color: 'primary' }}
              >
                {page.name}
              </Link>
            ),

            createdAt: new Date(page.createdAt).toLocaleString('en-VN'),

            updatedAt: new Date(page.updatedAt).toLocaleString('en-VN'),
          })}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------
