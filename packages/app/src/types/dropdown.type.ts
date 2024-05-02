import { IconProps } from './icon.type';

export type DropdownItem = {
  name: string;
  description?: string;
  icon?: IconProps;
};

export type DropdownButtonProps = {
  name: string;
  items: DropdownItem[];
  showIcon: boolean;
  styling?: {
    width?: number;
    borderRadius?: number;
    fontSize?: number;
    fontWeight?: number | string;
    fontFamily?: string;
    color?: string;
    borderColor?: string;
    backgroundColor?: string;
    activeColor?: string;
    activeBorderColor?: string;
    activeBackgroundColor?: string;
  };
  additionalKwargs?: any;
  onDropDownMenuClick?: (
    event: React.MouseEvent<HTMLElement>,
    additionalKwargs?: any,
  ) => void;
};

export type DropdownMenuItemProps = {
  name: string;
  index: number;
  description?: string;
  icon?: IconProps;
  showIcon?: boolean;
  active?: boolean;
  styling?: {
    fontSize?: number;
    fontWeight?: number | string;
    fontFamily?: string;
    color?: string;
    activeColor?: string;
    activeBackgroundColor?: string;
  };
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};
