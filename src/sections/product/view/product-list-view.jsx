import { Card, Link, Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { endpoints } from 'src/utils/axios';
import { convertImagePathToUrl } from 'src/utils/common';

import Iconify from 'src/components/iconify';
import ApiTable from 'src/components/api-table/api-table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { id: 'children', label: '', align: 'left' },
  { id: 'name', label: 'Name', align: 'left', search: true },
  { id: 'code', label: 'Code', align: 'left', search: true },
  { id: 'slug', label: 'Slug', align: 'left', search: true },
  { id: 'category', label: 'Category', align: 'left' },
  { id: 'country', label: 'Country', align: 'left' },
  { id: 'vendor', label: 'Vendor', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'salePrice', label: 'Sale Price', align: 'left' },
  { id: 'quantity', label: 'Quantity', align: 'left' },
  { id: 'createdAt', label: 'CreatedAt', align: 'left' },
];

export default function ProductListView() {
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
            name: 'Product',
            href: paths.dashboard.product.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.product.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Product
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
          apiURL={endpoints.product.list}
          mapFunction={(product) => ({
            ...product,
            name: (
              <Link
                href={`${product.id}/edit`}
                component={RouterLink}
                sx={{ textDecoration: 'none', color: 'primary' }}
              >
                {product.name}
              </Link>
            ),
            coverUrl: convertImagePathToUrl(product.image),
            createdAt: new Date(product.createdAt).toLocaleString('en-VN'),
            fat: 5,
          })}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------
