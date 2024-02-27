import { SerializedStyles } from '@emotion/react';
import SvgIcon from '@mui/material/SvgIcon';

export type SVGIcon = typeof SvgIcon;

export type IconProps = {
  icon: SVGIcon;
  className?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  additionalStyles?: SerializedStyles;
  onClick?: (e: React.MouseEvent) => void;
};
