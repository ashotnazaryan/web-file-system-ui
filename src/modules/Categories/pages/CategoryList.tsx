import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/system/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { useAppSelector } from 'store';
import { selectCategory } from 'store/reducers';
import { Category, CategoryType, IconType } from 'shared/models';
import { ROUTES, TABS } from 'shared/constants';
import Tabs from 'shared/components/Tabs';
import Skeleton from 'shared/components/Skeleton';
import PageTitle from 'shared/components/PageTitle';
import Icon from 'shared/components/Icon';
import CategoryIcon from 'shared/components/CategoryIcon';
import EmptyState from 'shared/components/EmptyState';

interface CategoryListProps { }

const CategoryList: React.FC<CategoryListProps> = () => {
  const { categories, status } = useAppSelector(selectCategory);
  const navigate = useNavigate();
  const { palette } = useTheme();
  const [categoryType, setCategoryType] = React.useState<number>(0);
  const tabs = TABS;

  const handleTabChange = (event: React.SyntheticEvent, value: number): void => {
    setCategoryType(value);
  };

  const handleCategoryIconClick = ({ id, name }: { id: Category['id'], name: Category['name'] }): void => {
    navigate(`${ROUTES.categories.path}/edit/${name}`, { state: { id } });
  };

  const openNewCategoryPage = (): void => {
    navigate(`${ROUTES.categories.path}/new`);
  };

  const getIconColor = (): string => {
    return categoryType === CategoryType.expense ? palette.secondary.main : palette.primary.main;
  };

  const getContent = (): React.ReactElement => {
    if (status === 'loading' || status !== 'succeeded') {
      return <Skeleton />;
    }

    if (!categories?.length) {
      return <EmptyState text='No categories available' />;
    }

    return (
      <Grid container columnGap={4} rowGap={4} sx={{ marginTop: 4 }}>
        {categories.filter(({ type }) => type === categoryType).map(({ name, type, icon, id }) => (
          <Grid item key={id}>
            <CategoryIcon id={id} name={name} type={type} icon={icon} onClick={handleCategoryIconClick} />
          </Grid>
        ))}
        <Grid item>
          <IconButton color='primary' onClick={openNewCategoryPage} sx={{ alignSelf: 'flex-end' }}>
            <Icon name={IconType.plus} sx={{ fontSize: 40, color: getIconColor() }}></Icon>
          </IconButton>
        </Grid>
      </Grid>
    );
  };

  const content = getContent();

  return (
    <Box flexGrow={1}>
      <PageTitle text='Categories' />
      <Tabs centered defaultValue={categoryType} tabs={tabs} onChange={handleTabChange} sx={{ marginBottom: 3 }} />
      {content}
    </Box>
  );
};

export default CategoryList;
