const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        thinGray: '#F2F2F2',
        thinLightGray: '#E5E5E5',
        lightGray: '#DADADA',
        semiMediumGray: '#999999',
        mediumGray: '#666666',
        darkGray: '#313131',
        lightThinBlueCus: '#DBF8E8',
        thinBlueCus: '#C3FDFF',
        lightGreen:"#16E6A8",
        skyCus: '#17F6FF',
        darkModeBlack: '#0B0B0B',
        secondary: '#2ED47A',
        primary: '#F7685B',
        lightPurple: '#AF53F4',
        lightWhite: '#EBF4F5',
        ...colors,    
      },
    },
    fontFamily: {
      poppins: ['Poppins', 'sans-serif'],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

// module.exports = {
//   purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
//   theme: {
//     extend: {
//       colors: {
//         brown: {
//           50: '#fdf8f6',
//           100: '#f2e8e5',
//           200: '#eaddd7',
//           300: '#e0cec7',
//           400: '#d2bab0',
//           500: '#bfa094',
//           600: '#a18072',
//           700: '#977669',
//           800: '#846358',
//           900: '#43302b',
//         },
//       }
//     },
//   },
// }
