import * as React from 'react';
import Box from '@mui/material/Box';
import { theme } from 'core/theme.config';
import { CategoryType, IconType } from 'shared/models';
import Icon from 'shared/components/Icon';
import Ellipsis from 'shared/components/Ellipsis';

interface CategoryIconProps {
  id: string;
  title: string;
  type: CategoryType;
  selected?: string;
  icon: IconType;
  onClick?: ({ id, title, icon }: { id: CategoryIconProps['id'], title: CategoryIconProps['title'], icon: CategoryIconProps['icon'] }) => void;
}

// TODO: make this component generic
const CategoryIcon: React.FC<CategoryIconProps> = ({ id, selected, title, type, icon, onClick }) => {
  const { palette: { primary, secondary } } = theme;
  const categoryColor = type === CategoryType.income ? primary.main : secondary.main;

  const onCategoryClick = (id: CategoryIconProps['id'], icon: CategoryIconProps['icon']) => (): void => {
    if (onClick) {
      onClick({ icon, id, title });
    }
  };

  const getColor = (): string => {
    return selected === id ? primary.contrastText : (type === CategoryType.income ? primary.main : secondary.main);
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' width={100}>
      <Box onClick={onCategoryClick(id, icon)} sx={{
        backgroundColor: selected === id ? categoryColor : 'transparent',
        border: `1px solid ${categoryColor}`,
        color: getColor(),
        height: 64,
        width: 64,
        borderRadius: '50%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}>
        <Icon name={icon}></Icon>
      </Box>
      <Ellipsis text={title} sx={{ width: '100%', textAlign: 'center', marginTop: 1 }} />
    </Box>
  );
};

export default CategoryIcon;