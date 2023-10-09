import SvgIcon from '@mui/material/SvgIcon';

export type SVGIcon = typeof SvgIcon;

export type IconProps = {
  icon: SVGIcon;
  fontSize?: string;
  width?: string;
  height?: string;
};
