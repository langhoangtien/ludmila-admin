import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { convertImagePathToUrl } from 'src/utils/common';

import { getProduct } from 'src/api/product';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ProductNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

export default function ProductEditView({ id }) {
  const settings = useSettingsContext();

  const [currentProduct, setCurrentProduct] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await getProduct(id);

        const productData = responseData.data;
        const image = convertImagePathToUrl(productData.image);

        const images = productData.images?.map((img) => convertImagePathToUrl(img));

        const variants = productData.variants.map((variant) => {
          const img = convertImagePathToUrl(variant.image);

          return { ...variant, image: img };
        });
        const category = productData.category ? productData.category._id : undefined;
        const country = productData.country ? productData.country._id : undefined;
        const brand = productData.brand ? productData.brand._id : undefined;
        const vendor = productData.vendor ? productData.vendor._id : undefined;
        const product = {
          ...productData,
          image,
          images,
          variants,
          category,
          country,
          brand,
          vendor,
        };
        console.log('CURENT PRODUCT', product);
        setCurrentProduct(product);
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
            name: 'Product',
            href: paths.dashboard.product.root,
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}

ProductEditView.propTypes = {
  id: PropTypes.string,
};
