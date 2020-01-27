require("dotenv").config({
  path: `.env`
});

module.exports = {
  siteMetadata: {
    title: `Gatsby Starter WordPress Community`,
    description: `Kick off a great Gatsby blog with this starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@pablovilafer`
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
        baseUrl: "mythwuld.com",
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
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logo.svg` // This path is relative to the root of the site.
      }
    },
    "gatsby-plugin-offline",
    `gatsby-plugin-netlify` // make sure to put last in the array
  ]
};
