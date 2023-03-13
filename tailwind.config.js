/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            transitionProperty: {
                'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke, filter'
            }
        }
    },
    plugins: [
        require('tailwind-scrollbar')
    ],
}
