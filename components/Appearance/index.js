import { useSelector } from "react-redux";
import { hexToRgb } from "~/lib/clientFunctions";

export default function Appearance(params) {
  const { settingsData: d } = useSelector((state) => state.settings);

  return (
    <style global jsx>
      {`
        :root {
          --primary: ${d.color.primary || "#7F39FB"};
          --primary_dark: ${d.color.primary_dark || "#530DCB"};
          --primary_contrast: ${d.color.primary_contrast || "#ffffff"};
          --primary_light: ${d.color.primary_hover || "#a583e1"};
          --primary_light_contrast: ${d.color.primary_hover_contrast ||
          "#000000"};
          --primary_color1: ${d.color.primary_color1 || "rgba(68, 30, 132, 1)"};
          --primary_color2: ${d.color.primary_color2 ||
          "rgba(107, 47, 209, 1)"};
          --primary_color3: ${d.color.primary_color3 ||
          "rgba(159, 105, 253, 1)"};
          --primary_color4: ${d.color.primary_color4 ||
          "rgba(240, 231, 255, 1)"};
          --primary_color5: ${d.color.primary_color5 || "#E6D1EF"};
          --secondary: ${d.color.secondary || "#FF0080"};
          --secondary_contrast: ${d.color.secondary_contrast || "#ffffff"};
          --blue_white: #f9fbfd;
          --primary_opacity: ${hexToRgb(d.color.primary || "#a583e1")};
          --black: #393939;
          --deep_black: #000000;
          --light_black: #848484;
          --grey: ${d.color.body_gray || "#d9e0e5"};
          --grey_contrast: ${d.color.body_gray_contrast || "#000000"};
          --light_gray: #fafafa;
          --deep_gray: #dbdbdb;
          --white: #ffffff;
          --danger: #cf4436;
          --success: #198754;
          --success_hover: #157347;

          --purple: #9945ff;
          --purple-light: #e9d4ff;
          --purple-light-opa50: rgba(233, 212, 255, 0.5);
          --purple-dark: #5d00ce;

          --bg-dark: #07021b;
          --bg-input-field: #f1f4f6;
          --bg-navigator: #f3f5f7;
          --bg-section-divider: #f1f4f6;
          --bg-white-cool: #f8f9fd;
          --bg-white-warm: #fafafa;

          --gray-300: #cad0d9;
          --gray-400: #9ca3af;

          --main-secondary: #fb64b6;
          --main-system-red: #d40022;
          --main-system-skyblue: #6b80dc;

          --stroke-button: #d3dadf;
          --stroke-DDDDDD: #dddddd;
          --stroke-E8ECEF: #e8ecef;
          --border_color: #dfdfdf;

          --text-121212: #121212;
          --text-3f3f3f: #3f3f3f;
          --text-555555: #555555;
          --text-757575: #757575;
          --text-949494: #949494;
          --text-a6a6a6: #a6a6a6;

          --container-width: 1280px;
        }
      `}
    </style>
  );
}
