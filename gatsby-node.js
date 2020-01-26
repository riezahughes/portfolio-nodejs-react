const path = require('path');
const _ = require('lodash');
const slash = require(`slash`)

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Sometimes, optional fields tend to get not picked up by the GraphQL
  // interpreter if not a single content uses it. Therefore, we're putting them
  // through `createNodeField` so that the fields still exist and GraphQL won't
  // trip up. An empty string is still required in replacement to `null`.
  switch (node.internal.type) {
    case 'MarkdownRemark': {
      const { permalink, layout, primaryTag } = node.frontmatter;
      const { relativePath } = getNode(node.parent);

      let slug = permalink;

      if (!slug) {
        slug = `/${relativePath.replace('.md', '')}/`;
      }

      // Used to generate URL to view this content.
      createNodeField({
        node,
        name: 'slug',
        value: slug || '',
      });

      // Used to determine a page layout.
      createNodeField({
        node,
        name: 'layout',
        value: layout || '',
      });

      createNodeField({
        node,
        name: 'primaryTag',
        value: primaryTag || '',
      });
    }
  }
};


exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // The “graphql” function allows us to run arbitrary
  // queries against the local Gatsby GraphQL schema. Think of
  // it like the site has a built-in database constructed
  // from the fetched data that you can run queries against.
  const result = await graphql(`
    {
      allWordpressPage {
        edges {
          node {
            id
            path
            status
            template
          }
        }
      }
      allWordpressPost {
        edges {
          node {
            id
            path
            status
            template
            format
          }
        }
      }
    }
  `)

  // Check for any errors
  if (result.errors) {
    throw new Error(result.errors)
  }

  // Access query results via object destructuring
  const { allWordpressPage, allWordpressPost } = result.data

  // Create Page pages.
  const pageTemplate = path.resolve(`./src/templates/post.tsx`)
  // We want to create a detailed page for each page node.
  // The path field contains the relative original WordPress link
  // and we use it for the slug to preserve url structure.
  // The Page ID is prefixed with 'PAGE_'
  allWordpressPage.edges.forEach(edge => {
    // Gatsby uses Redux to manage its internal state.
    // Plugins and sites can use functions like "createPage"
    // to interact with Gatsby.
    createPage({
      // Each page is required to have a `path` as well
      // as a template component. The `context` is
      // optional but is often necessary so the template
      // can query data specific to each page.
      path: edge.node.path,
      component: slash(pageTemplate),
      context: {
        id: edge.node.id,
      },
    })
  })

  const postTemplate = path.resolve(`./src/templates/post.tsx`)
  // We want to create a detailed page for each post node.
  // The path field stems from the original WordPress link
  // and we use it for the slug to preserve url structure.
  // The Post ID is prefixed with 'POST_'
  allWordpressPost.edges.forEach(edge => {
    createPage({
      path: edge.node.path,
      component: slash(postTemplate),
      context: {
        id: edge.node.id,
      },
    })
  })
}



// exports.createPages = async ({ graphql, actions }) => {
//   const { createPage } = actions;

//   const result = await graphql(`
//     {
//       allMarkdownRemark(
//         limit: 2000
//         sort: { fields: [frontmatter___date], order: ASC }
//         filter: { frontmatter: { draft: { ne: true } } }
//       ) {
//         edges {
//           node {
//             excerpt
//             timeToRead
//             frontmatter {
//               title
//               tags
//               date
//               draft
//               image {
//                 childImageSharp {
//                   fluid(maxWidth: 3720) {
//                     aspectRatio
//                     base64
//                     sizes
//                     src
//                     srcSet
//                   }
//                 }
//               }
//               author {
//                 id
//                 bio
//                 avatar {
//                   children {
//                     ... on ImageSharp {
//                       fixed(quality: 90) {
//                         src
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             fields {
//               layout
//               slug
//             }
//           }
//         }
//       }
//       allAuthorYaml {
//         edges {
//           node {
//             id
//           }
//         }
//       }
//     }
//   `);

//   if (result.errors) {
//     console.error(result.errors);
//     throw new Error(result.errors);
//   }

//   // Create post pages
//   const posts = result.data.allMarkdownRemark.edges;

//   // Create paginated index
//   const postsPerPage = 6;
//   const numPages = Math.ceil(posts.length / postsPerPage);

//   Array.from({ length: numPages }).forEach((_, i) => {
//     createPage({
//       path: i === 0 ? '/' : `/${i + 1}`,
//       component: path.resolve('./src/templates/index.tsx'),
//       context: {
//         limit: postsPerPage,
//         skip: i * postsPerPage,
//         numPages,
//         currentPage: i + 1,
//       },
//     });
//   });

//   posts.forEach(({ node }, index) => {
//     const { slug, layout } = node.fields;
//     const prev = index === 0 ? null : posts[index - 1].node;
//     const next = index === posts.length - 1 ? null : posts[index + 1].node;

//     createPage({
//       path: slug,
//       // This will automatically resolve the template to a corresponding
//       // `layout` frontmatter in the Markdown.
//       //
//       // Feel free to set any `layout` as you'd like in the frontmatter, as
//       // long as the corresponding template file exists in src/templates.
//       // If no template is set, it will fall back to the default `post`
//       // template.
//       //
//       // Note that the template has to exist first, or else the build will fail.
//       component: path.resolve(`./src/templates/${layout || 'post'}.tsx`),
//       context: {
//         // Data passed to context is available in page queries as GraphQL variables.
//         slug,
//         prev,
//         next,
//         primaryTag: node.frontmatter.tags ? node.frontmatter.tags[0] : '',
//       },
//     });
//   });

//   // Create tag pages
//   const tagTemplate = path.resolve('./src/templates/tags.tsx');
//   const tags = _.uniq(
//     _.flatten(
//       result.data.allMarkdownRemark.edges.map(edge => {
//         return _.castArray(_.get(edge, 'node.frontmatter.tags', []));
//       }),
//     ),
//   );
//   tags.forEach(tag => {
//     createPage({
//       path: `/tags/${_.kebabCase(tag)}/`,
//       component: tagTemplate,
//       context: {
//         tag,
//       },
//     });
//   });

//   // Create author pages
//   const authorTemplate = path.resolve('./src/templates/author.tsx');
//   result.data.allAuthorYaml.edges.forEach(edge => {
//     createPage({
//       path: `/author/${_.kebabCase(edge.node.id)}/`,
//       component: authorTemplate,
//       context: {
//         author: edge.node.id,
//       },
//     });
//   });
// };

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  // adds sourcemaps for tsx in dev mode
  if (stage === `develop` || stage === `develop-html`) {
    actions.setWebpackConfig({
      devtool: 'eval-source-map',
    });
  }
};
