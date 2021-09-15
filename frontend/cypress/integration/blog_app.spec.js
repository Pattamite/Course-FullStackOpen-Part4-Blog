describe('Blog app', function() {
  const backendUrl = 'http://localhost:3003'
  const frontendUrl = 'http://localhost:3000';
  
  const username = 'testUser';
  const password = 'aqwsderf';
  const name = 'Test User';

  beforeEach(function() {
    cy.request('POST', `${backendUrl}/api/testing/reset`);
    const user = {
      name: name,
      username: username,
      password: password
    }
    cy.request('POST', `${backendUrl}/api/users/`, user) ;
    cy.visit(frontendUrl);
  });

  it('front page can be opened', function() {
    cy.contains('Blogs');
  });

  it('login form can be opened', function() {
    cy.contains('log in').click();
  });

  it('user can login', function () {
    cy.contains('log in').click();
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#login-btn').click();

    cy.contains(`${name} logged-in`);
  });

  it('user can logout after logged in', function () {
    cy.contains('log in').click();
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('#login-btn').click();

    cy.contains(`${name} logged-in`);

    cy.get('#logout-btn').click();
    cy.contains('log in');
  });

  it('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type(username)
    cy.get('#password').type(`${password}lmaoxd`)
    cy.get('#login-btn').click()

    cy.get('.notification').contains('Login fail.');
  })

  describe('when logged in', function() {
    const blogTitle = 'testTitle';
    const blogUrl = 'testUrl';

    beforeEach(function() {
      cy.login({
        username: username,
        password: password
      });
    });

    it('a new blog can be created', function() {
      cy.contains('new blog').click();
      cy.get('.titleInput').type(blogTitle);
      cy.get('.urlInput').type(blogUrl);
      cy.contains('save').click();
      cy.get('#blogs').should('contain', blogTitle);
    });

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: blogTitle,
          url: blogUrl
        });
      });

      it('a blog can be deleted', function () {
        cy.contains('delete').click();
        cy.get('#blogs').should('not.contain', blogTitle);
      });

      it('user can like a blog', function () {

        cy.get('#blogs')
          .contains(`${blogTitle}`)
          .contains('show')
          .click();
        
        cy.get('#blogs')
          .contains('Likes: 0')
          .contains('Like')
          .click();
        
          cy.get('#blogs')
          .contains('Likes: 1')
      });
    });

    describe('and several blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: `${blogTitle}1`,
          url: blogUrl
        });
        cy.createBlog({
          title: `${blogTitle}2`,
          url: blogUrl
        });
        cy.createBlog({
          title: `${blogTitle}3`,
          url: blogUrl
        });
      });

      it('every blog can be deleted', function () {
        cy
          .contains(`${blogTitle}1`)
          .contains(`delete`)
          .click();
        cy.get('#blogs').should('not.contain', `${blogTitle}1`);
        cy.get('#blogs').should('contain', `${blogTitle}2`);
        cy.get('#blogs').should('contain', `${blogTitle}3`);

        cy
          .contains(`${blogTitle}2`)
          .contains(`delete`)
          .click();
        cy.get('#blogs').should('not.contain', `${blogTitle}1`);
        cy.get('#blogs').should('not.contain', `${blogTitle}2`);
        cy.get('#blogs').should('contain', `${blogTitle}3`);

        cy
          .contains(`${blogTitle}3`)
          .contains(`delete`)
          .click();
        cy.get('#blogs').should('not.contain', `${blogTitle}1`);
        cy.get('#blogs').should('not.contain', `${blogTitle}2`);
        cy.get('#blogs').should('not.contain', `${blogTitle}3`);
      });
    });
  });
});