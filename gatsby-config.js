require("dotenv").config({
  path: `.env`
});

module.exports = {
  siteMetadata: {
    title: `Daniel Ruxton - Portfolio`,
    description: `A portfolio showcasing all my most fun and entertaining things i've worked on over the years.`,
    author: `@riezahughes`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    {
      resolve: "gatsby-source-wordpress",
      options: {
        //Default options are for WP sites hosted on wordpress.com
        //For sites self hosted and other options check:
        //https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-source-wordpress
        baseUrl: process.env.BASE_URL,
        protocol: "https",
        hostingWPCOM: false,
        useACF: false,
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-purgecss`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `daniel-ruxton-portfolio`,
        short_name: `portfolio`,
        start_url: `/`,
        background_color: `#000000`,
        theme_color: `#000000`,
        display: `minimal-ui`,
        icon: `src/images/logo.svg` // This path is relative to the root of the site.

      }
    },
    "gatsby-plugin-offline",
    `gatsby-plugin-netlify` // make sure to put last in the array
  ]
};
