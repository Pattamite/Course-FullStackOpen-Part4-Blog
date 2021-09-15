const backendUrl = 'http://localhost:3003'
const frontendUrl = 'http://localhost:3000';
const loggedBlogAppUserKey = 'loggedBlogAppUser';

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${backendUrl}/api/login`, {
    username: username,
    password: password
  }).then(response => {
    localStorage.setItem(loggedBlogAppUserKey, JSON.stringify(response.body));
    cy.visit(frontendUrl);
  });
});

Cypress.Commands.add('createBlog', ({ title, url }) => {
  cy.request({
    url: `${backendUrl}/api/blogs`,
    method: 'POST',
    body: {
      title: title,
      url: url
    },
    headers: {
      'Authorization': `bearer ${JSON.parse(localStorage.getItem(loggedBlogAppUserKey)).token}`
    }
  });

  cy.visit(frontendUrl);
})