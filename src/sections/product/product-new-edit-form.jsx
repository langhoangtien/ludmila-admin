import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  Table,
  Button,
  Dialog,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';

import { fData } from 'src/utils/format-number';

import { _tags } from 'src/_mock';
// import { useGetCategories } from 'src/api/category';

import slugify from 'slugify';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  randomProductCode,
  convertImagePathToUrl,
  convertImageUrlToPath,
  makeProductVariantsFromAttributes,
} from 'src/utils/common';

import { getBrands } from 'src/api/brand';
import { getCountries } from 'src/api/country';
import { getCategories } from 'src/api/category';
import { uploadFile, uploadFiles } from 'src/api/file';
import { addProduct, updateProduct } from 'src/api/product';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { TableHeadCustom } from 'src/components/table';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
  RHFUploadAvatar,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------
const TABLE_HEAD_PRODUCT_VARIANT = [
  { id: 'name', label: 'Name' },
  { id: 'image', label: 'Image' },
  { id: 'price', label: 'Price' },
  { id: 'salePrice', label: 'Giá khuyến mại' },
  { id: 'discount', label: 'Giảm giá' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'attributes', label: 'Attributes' },
];
const TABLE_HEAD = [
  { id: 'name', label: 'Attribute name' },
  { id: 'values', label: 'Attribute values' },
  { id: 'delete', label: '' },
];
export default function ProductNewEditForm({ currentProduct }) {
  // const mdUp = useResponsive('up', 'md');
  const router = useRouter();
  let temporaryAttributes = [];
  const { enqueueSnackbar } = useSnackbar();
  const [dataSelect, setDataSelect] = useState({ categories: [], countries: [], brands: [] });
  const dialog = useBoolean();

  const NewProductSchema = Yup.object().shape(
    {
      image: Yup.mixed().nullable(),
      name: Yup.string().required('Name is required'),
      slug: Yup.string().when('slug', (val, schema) => {
        console.log('VAL', val);

        if (val?.[0]) {
          return Yup.string().matches(
            /^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/gim,
            'Requires correct slug url format'
          );
        }
        return Yup.string().notRequired();
      }),
      code: Yup.string().when('code', (val, schema) => {
        if (val?.[0]) {
          return Yup.string().min(2, 'Code should be at least 2 characters');
        }
        return Yup.string().notRequired();
      }),

      barCode: Yup.string(),
      introduction: Yup.string(),
      images: Yup.array(),
      tags: Yup.array(),
      // category: Yup.array().of(Yup.string()).required('Category is required'),
      category: Yup.array().min(1, 'Category is required'),
      country: Yup.string().required('Country is required'),
      brand: Yup.string().required('Brand is required'),
      price: Yup.number().moreThan(0, 'Price should not be $0.00'),
      description: Yup.string(),
      // not required

      attributes: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required('Attribute name is required'),
          values: Yup.array().min(1, 'Attribute values is required'),
        })
      ),
      variants: Yup.array().of(
        Yup.object().shape({
          image: Yup.mixed(),
          quantity: Yup.number().required('Variant quantity is required'),
          price: Yup.number().required('Variant quantity is required'),
          salePrice: Yup.number()
            .required('Variant salePrice is required')
            .when('price', (price, schema) =>
              schema.max(price, 'Sale price should not be greater than price')
            ),
          attributes: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required('Variant Attribute name is required'),
              value: Yup.string().required('Variant Attribute value is required'),
            })
          ),
        })
      ),
    },
    [
      ['slug', 'slug'],
      ['code', 'code'],
    ]
  );

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      slug: currentProduct?.slug || undefined,
      description: currentProduct?.description || '',
      introduction: currentProduct?.introduction || '',
      image: currentProduct?.image || '',
      images: currentProduct?.images || [],
      //
      code: currentProduct?.code || undefined,
      barCode: currentProduct?.barCode || '',
      tags: currentProduct?.tags || [],
      category: currentProduct?.category || [],
      country: currentProduct?.country || '',
      brand: currentProduct?.brand || '',
      attributes: currentProduct?.attributes || [],
      variants: currentProduct?.variants || [
        { name: '', image: '', price: 0, salePrice: 0, quantity: 0, attributes: [] },
      ],
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    control,

    formState: { isSubmitting },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'attributes',
  });
  const { fields: productVariantfields } = useFieldArray({
    control,
    name: 'variants',
  });
  const values = watch();
  console.log(values);

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    const variants = values.variants.map((variant) => ({
      ...variant,
      attributes: variant.attributes.length ? variant.attributes : undefined,
      image: convertImageUrlToPath(variant.image),
    }));

    const dataSend = {
      ...data,
      category: [...new Set(data.category.map((i) => i._id))],
      slug: data.slug
        ? data.slug
        : slugify(data.name, { locale: 'vi', remove: /[*+~.()'"!:@]/g }).toLowerCase(),
      image: convertImageUrlToPath(data.image),
      code: data.code || randomProductCode(),

      images: data.images.map((img) => convertImageUrlToPath(img)),
      variants,
      attributes: data.attributes.length ? data.attributes : undefined,
    };

    // return;
    try {
      if (currentProduct) {
        await updateProduct(currentProduct.id, dataSend);
      } else {
        await addProduct(dataSend);
      }

      reset();
      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.product.root);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const files = values.images || [];
      const filesUpload = await uploadFiles(acceptedFiles);
      const filesUploadData = filesUpload.data.map((file) => convertImagePathToUrl(file.path));
      setValue('images', [...files, ...filesUploadData], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleDropImage = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    try {
      const dataResponse = await uploadFile(file);
      const url = convertImagePathToUrl(dataResponse.data.path);

      setValue('image', url, { shouldValidate: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDropVariantImage = async (acceptedFiles, index) => {
    const file = acceptedFiles[0];

    try {
      const dataResponse = await uploadFile(file);
      const data = convertImagePathToUrl(dataResponse.data.path);
      const variants = values.variants.map((variant, indexVariant) =>
        indexVariant !== index ? variant : { ...variant, name: index, image: data }
      );

      setValue('variants', variants, { shouldValidate: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const handleAdd = () => {
    append({
      name: '',
      values: [],
    });
  };
  const handleRemove = (index) => {
    remove(index);
  };

  const handleOpenDialog = () => {
    temporaryAttributes = [...values.attributes];

    dialog.onTrue();
  };
  const handleSaveDialog = () => {
    const attributesFilter = values.attributes.filter((i) => i.name && i.values.length);
    if (attributesFilter.length === 0) {
      setValue(
        'variants',
        [
          {
            name: 'TÊN',
            image: '',
            price: 0,
            salePrice: 0,
            quantity: 0,
            attributes: [],
          },
        ],
        { shouldValidate: true }
      );
      dialog.onFalse();
      return;
    }
    const attributes = makeProductVariantsFromAttributes(attributesFilter);
    const variants = attributes.map((attribute) => ({
      name: 'TÊN',
      image: '',
      price: 0,
      salePrice: 0,
      quantity: 0,
      attributes: attribute,
    }));

    setValue('variants', variants, { shouldValidate: true });
    dialog.onFalse();
  };
  const handleCloseDialog = () => {
    const attributes = [...temporaryAttributes].filter(
      (attribute) => attribute.name && attribute.values.length
    );
    dialog.onFalse();
    setValue('attributes', attributes, { shouldValidate: true });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const dataArray = await Promise.all([getCategories(), getCountries(), getBrands()]);
        const categories = dataArray[0].data.items;
        const countries = dataArray[1].data.items;
        const brands = dataArray[2].data.items;
        setDataSelect({ categories, countries, brands });
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const renderVariantProperty = (
    <Grid xs={6}>
      <Dialog open={dialog.value} maxWidth="md" onClose={handleCloseDialog} fullWidth>
        <DialogTitle>Thêm thuộc tính cho sản phẩm</DialogTitle>

        <DialogContent>
          <Typography sx={{ color: 'text.secondary', p: 1 }}>
            Nhấn <i>Enter</i> để thêm thuộc tính cho sản phẩm
          </Typography>
          <Stack spacing={3}>
            <Box
              columnGap={2}
              rowGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              }}
            >
              <Table sx={{ minWidth: 400 }}>
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {fields.map((item, indexItem) => (
                    <TableRow key={item.id}>
                      <TableCell align="left">
                        <RHFTextField
                          size="small"
                          label="Name"
                          name={`attributes[${indexItem}].name`}
                          placeholder="Màu sắc, Kích cỡ,..."
                        />
                      </TableCell>
                      <TableCell align="right">
                        <RHFAutocomplete
                          size="small"
                          fullWidth
                          label="Attribute Value"
                          placeholder="Xanh, Đỏ, S, L, XL,..."
                          multiple
                          freeSolo
                          name={`attributes[${indexItem}].values`}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              {...params}
                              label="Values"
                              placeholder="Xanh, Đỏ, Trắng, ..."
                            />
                          )}
                          options={[].map((option) => option)}
                          renderTags={(selected, getTagProps) =>
                            selected.map((option, index) => (
                              <Chip
                                {...getTagProps({ index })}
                                key={option}
                                label={option}
                                size="small"
                                color="info"
                                variant="soft"
                              />
                            ))
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleRemove(indexItem)}>
                          {' '}
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Stack>
          <Stack
            spacing={3}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-end', md: 'center' }}
            justifyContent="flex-end"
          >
            <Button
              size="small"
              color="primary"
              onClick={handleAdd}
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{ flexShrink: 0 }}
            >
              Add Item
            </Button>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleSaveDialog} variant="contained">
            Save
          </Button>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );

  const renderProductVariants = (
    <Grid xs={12}>
      <Card>
        <CardHeader title="Variant" />
        <Box p={3}>
          <Stack p={1} alignItems="flex-end">
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={handleOpenDialog}
              startIcon={<Iconify icon="mingcute:add-line" />}
              sx={{ flexShrink: 0 }}
            >
              Add Item
            </Button>
          </Stack>
          <Stack spacing={3}>
            <Box
              columnGap={2}
              rowGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(1, 1fr)',
              }}
            >
              <Table sx={{ minWidth: 480 }}>
                <TableHeadCustom headLabel={TABLE_HEAD_PRODUCT_VARIANT} />
                <TableBody>
                  {productVariantfields.map((item, indexItem) => (
                    <TableRow key={item.id}>
                      <TableCell align="left">Tên</TableCell>
                      <TableCell align="left">
                        {' '}
                        <RHFUploadAvatar
                          borderRadius="none"
                          sx={{ p: 0 }}
                          name={`variants[${indexItem}].image`}
                          maxSize={3145728}
                          onDrop={(acceptedFiles) =>
                            handleDropVariantImage(acceptedFiles, indexItem)
                          }
                          width={50}
                          height={50}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <RHFTextField
                          name={`variants[${indexItem}].price`}
                          label="Price"
                          placeholder={0}
                          size="small"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box component="span" sx={{ color: 'text.disabled' }}>
                                  đ
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <RHFTextField
                          name={`variants[${indexItem}].salePrice`}
                          label="Giá khuyến mại"
                          placeholder={0}
                          size="small"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box component="span" sx={{ color: 'text.disabled' }}>
                                  đ
                                </Box>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell align="left">
                        {caculateDiscount(
                          values.variants[indexItem].price,
                          values.variants[indexItem].salePrice
                        )}
                        %
                      </TableCell>
                      <TableCell align="left">
                        <RHFTextField
                          name={`variants[${indexItem}].quantity`}
                          label="Quantity"
                          size="small"
                          placeholder="0"
                          type="number"
                          InputLabelProps={{ shrink: true }}
                        />
                      </TableCell>
                      <TableCell align="left">
                        <Box sx={{ color: 'error.main' }} component="span">
                          {item.attributes.map((i) => `${i.name}: ${i.value}`).toString()}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Stack>
        </Box>
      </Card>
    </Grid>
  );

  const renderPost = (
    <Grid xs={12} md={12}>
      <Card>
        <CardHeader title="Post" />

        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Content</Typography>
            <RHFEditor simple name="description" />
          </Stack>
        </Stack>
      </Card>
    </Grid>
  );

  const renderActions = (
    <Grid xs={12}>
      <Stack justifyContent="flex-end" direction="row" p={3} spacing={2}>
        <FormControlLabel control={<Switch defaultChecked />} label="Publish" />
        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Stack>
    </Grid>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card>
            <CardHeader title="Avatar" />
            <Box sx={{ mb: 5, p: 3 }}>
              <RHFUploadAvatar
                name="image"
                maxSize={3145728}
                onDrop={handleDropImage}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>
        {/* PROPERTY */}
        <Grid xs={12} md={8}>
          <Card>
            <CardHeader title="Infomation" />

            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                columnGap={2}
                rowGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField required size="small" name="name" label="Product Name" />
                <RHFTextField
                  type="text"
                  size="small"
                  name="slug"
                  label="Product URL(Không bắt buộc)"
                />
                <RHFTextField size="small" name="code" label="Product Code" />

                <RHFTextField size="small" name="barCode" label="Product barCode" />
              </Box>
              <RHFTextField
                size="small"
                name="introduction"
                label="Introduction"
                multiline
                rows={4}
              />
            </Stack>
          </Card>
        </Grid>

        {/* DETAIL */}
        <Grid xs={12} md={4}>
          <Card>
            <CardHeader title="Images" />
            <Stack p={3} spacing={3}>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card>
            <CardHeader title="Properties" />

            <Stack spacing={3} sx={{ p: 3 }}>
              <Box
                columnGap={2}
                rowGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <RHFAutocomplete
                  name="category"
                  label="Category"
                  size="small"
                  placeholder="+ Category"
                  multiple
                  filterSelectedOptions
                  options={dataSelect.categories.map((option) => ({
                    name: option.name,
                    _id: option._id,
                  }))}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option.name}
                    </li>
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option._id}
                        label={option.name}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    ))
                  }
                />
                {/* <RHFSelect
                  size="small"
                  name="category"
                  label="Category"
                  required
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {dataSelect.categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </RHFSelect> */}
                <RHFSelect
                  size="small"
                  name="country"
                  label="Country"
                  required
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {dataSelect.countries.map((country) => (
                    <MenuItem key={country._id} value={country._id}>
                      {country.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFSelect
                  size="small"
                  name="brand"
                  label="Brand"
                  required
                  InputLabelProps={{ shrink: true }}
                  PaperPropsSx={{ textTransform: 'capitalize' }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {dataSelect.brands.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFAutocomplete
                  name="tags"
                  label="Tags"
                  size="small"
                  placeholder="+ Tags"
                  multiple
                  freeSolo
                  options={_tags.map((option) => option)}
                  getOptionLabel={(option) => option}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                  renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    ))
                  }
                />
              </Box>
            </Stack>
          </Card>
        </Grid>

        {renderVariantProperty}
        {renderProductVariants}
        {renderPost}
        {renderActions}
      </Grid>
    </FormProvider>
  );
}

function caculateDiscount(price, salePrice) {
  if (price === 0) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

ProductNewEditForm.propTypes = {
  currentProduct: PropTypes.object,
};
