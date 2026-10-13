import { createTheme, rem } from "@mantine/core";
export const theme = createTheme({
  primaryColor: "ember",
  primaryShade: 7,
  colors: {
    ember: [
      "#fff4ef",
      "#ffe6db",
      "#f9c9b7",
      "#f1aa90",
      "#e98e6e",
      "#df7958",
      "#d86b49",
      "#bf5637",
      "#aa4a2f",
      "#963d26",
    ],
    forest: [
      "#eef8f2",
      "#dceee3",
      "#b6dcc5",
      "#8bc8a4",
      "#68b789",
      "#51ac78",
      "#43a66f",
      "#348f5d",
      "#287f51",
      "#176e42",
    ],
  },
  fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
  headings: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontWeight: "700",
  },
  defaultRadius: "md",
  radius: { xs: rem(6), sm: rem(8), md: rem(12), lg: rem(16), xl: rem(22) },
  shadows: {
    xs: "0 1px 2px rgba(30,43,37,.05)",
    sm: "0 8px 28px rgba(30,43,37,.07)",
    md: "0 16px 40px rgba(30,43,37,.10)",
  },
  components: {
    Button: {
      defaultProps: { radius: "md" },
      styles: { root: { fontWeight: 650 } },
    },
    Card: { defaultProps: { radius: "lg" } },
    Input: {
      styles: { input: { borderColor: "#dedfd9", backgroundColor: "#fff" } },
    },
    Modal: {
      defaultProps: {
        radius: "lg",
        centered: true,
        overlayProps: { backgroundOpacity: 0.36, blur: 3 },
      },
    },
  },
});
