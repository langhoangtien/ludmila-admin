import * as Yup from 'yup';
import slugify from 'slugify';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Button,
  MenuItem,
  CardHeader,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { addCategory, updateCategory } from 'src/api/category';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

const LIST_ICON = [
  {
    name: 'than_kinh_nao_level_2.png',
    count: 103,
    image: '/assets/images/categories/than_kinh_nao_level_2.png',
  },
  {
    name: 'tpcn_vitamin_khoang_chat_level_2.png',
    count: 103,
    image: '/assets/images/categories/tpcn_vitamin_khoang_chat_level_2.png',
  },
  {
    name: 'suc_khoe_tim_mach_level_2.png',
    count: 54,
    image: '/assets/images/categories/suc_khoe_tim_mach_level_2.png',
  },
  {
    name: 'tang_suc_de_khang_mien_dich_level_3.png',
    count: 54,
    image: '/assets/images/categories/tang_suc_de_khang_mien_dich_level_3.png',
  },
  {
    name: 'ho_tro_tieu_hoa_level_2.png',
    count: 323,
    image: '/assets/images/categories/ho_tro_tieu_hoa_level_2.png',
  },
  {
    name: 'sinh_li_noi_tiet_to_level_2.png',
    count: 103,
    image: '/assets/images/categories/sinh_li_noi_tiet_to_level_2.png',
  },
  {
    name: 'dinh_duong_level_2.png',
    count: 33,
    image: '/assets/images/categories/dinh_duong_level_2.png',
  },
  {
    name: 'ho_tro_dieu_tri_level_2.png',
    count: 33,
    image: '/assets/images/categories/ho_tro_dieu_tri_level_2.png',
  },
  {
    name: 'giai_phap_lan_da_level_2.png',
    count: 33,
    image: '/assets/images/categories/giai_phap_lan_da_level_2.png',
  },
  {
    name: 'cham_soc_da_mat_level_2.png',
    count: 33,
    image: '/assets/images/categories/cham_soc_da_mat_level_2.png',
  },
  {
    name: 'ho_tro_lam_dep_level_2.png',
    count: 33,
    image: '/assets/images/categories/ho_tro_lam_dep_level_2.png',
  },
  {
    name: 'ho_tro_tinh_duc_level_2.png',
    count: 33,
    image: '/assets/images/categories/ho_tro_tinh_duc_level_2.png',
  },
];
export default function EditForm({ dialog, categories, categoryCurrent }) {
  const NewCategorySchema = Yup.object().shape(
    {
      code: Yup.string().when('code', (val, schema) => {
        if (val?.[0]) {
          console.log('val_cate', val);

          return Yup.string().matches(
            /^[a-z0-9]+(?:(?:-|_)+[a-z0-9]+)*$/gim,
            'Requires correct slug url format'
          );
        }
        return Yup.string().notRequired();
      }),

      name: Yup.string().required('Name is required'),
      icon: Yup.string().nullable(),
    },
    [['code', 'code']]
  );
  const defaultValues = useMemo(
    () => ({
      code: undefined,
      name: '',
      _id: '',
      parentId: null,
      icon: null,
    }),
    []
  );
  const methods = useForm({ resolver: yupResolver(NewCategorySchema), defaultValues });
  const {
    reset,
    watch,
    setValue,
    handleSubmit,

    formState: { isSubmitting },
  } = methods;
  const values = watch();
  const onSubmit = handleSubmit(async (data) => {
    try {
      const mappedData = {
        ...data,
        code: data.code
          ? data.code
          : slugify(data.name, { locale: 'vi', remove: /[*+~.()'"!:@]/g }).toLowerCase(),
      };
      if (!values._id) await addCategory(mappedData);
      if (values._id) await updateCategory(values._id, mappedData);
      enqueueSnackbar('Category created successfully', { variant: 'success' });

      dialog.onFalse();
    } catch (error) {
      console.log(error);
    }
  });
  useEffect(() => {
    if (categoryCurrent) {
      setValue('code', categoryCurrent.code);
      setValue('name', categoryCurrent.name);
      setValue('parentId', categoryCurrent.parentId);
      setValue('_id', categoryCurrent._id);
      setValue('icon', categoryCurrent.icon);
    } else {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryCurrent]);
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <DialogTitle>new Category</DialogTitle>
      <DialogContent>
        <Grid xs={12} md={4}>
          <Card>
            <CardHeader title="Avatar" />
            <Stack p={3} spacing={3}>
              <RHFSelect
                size="small"
                name="parentId"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                label="Parent Category"
              >
                <MenuItem value={null}>
                  <em>None</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFSelect
                size="small"
                name="icon"
                InputLabelProps={{ shrink: true }}
                PaperPropsSx={{ textTransform: 'capitalize' }}
                label="Icon"
              >
                <MenuItem value={null}>
                  <em>None</em>
                </MenuItem>
                {LIST_ICON.map((icon) => (
                  <MenuItem key={icon.name} value={icon.name}>
                    <img
                      alt="s"
                      src={icon.image}
                      style={{ width: 24, height: 24, marginRight: 5 }}
                    />

                    {icon.name}
                  </MenuItem>
                ))}
              </RHFSelect>
              <RHFTextField required size="small" name="name" label="Category Name" />
              <RHFTextField size="small" name="code" label="Category Code" />
            </Stack>
          </Card>
        </Grid>
      </DialogContent>

      <DialogActions>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {!values._id ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
        <Button onClick={dialog.onFalse} variant="contained">
          Close
        </Button>
      </DialogActions>
    </FormProvider>
  );
}

EditForm.propTypes = {
  dialog: PropTypes.shape({
    onFalse: PropTypes.func.isRequired,
  }).isRequired,
  categories: PropTypes.array.isRequired,
  categoryCurrent: PropTypes.object,
};
