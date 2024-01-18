import { createTheme } from "@atlaskit/theme";

const lightThemeColors = {
  text: "#FF0000",
};

const darkThemeColors = {
  text: "#FF0000",
};

const lightTheme = createTheme(() => ({
  canvasBGColor: '#F8F8F8',
  canvasGridColor: '#49494A',

  cardPriBGColor: '#FFFFFF',
  cardSecBGColor: '#F0F0F0',
  cardPriColor: '#005FB8'
}));

const darkTheme = createTheme(() => ({
  canvasBGColor: '#202020',
  canvasGridColor: '#474748',

  cardPriBGColor: '#3D3D3D',
  cardSecBGColor: '#212121'
}));

export { lightTheme, darkTheme };
