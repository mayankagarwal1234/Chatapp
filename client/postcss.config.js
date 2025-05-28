import tailwind from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: {
    '@tailwindcss/postcss': tailwind({
      config: './tailwind.config.js'
    }),
    autoprefixer: autoprefixer
  }
}