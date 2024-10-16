describe('Add Stack Page', () => {
  const api = 'https://stacks-api-iota.vercel.app/albums';
  const newAlbum = {
    albumName: 'Test Album',
    artist: 'Test Artist',
    releaseDate: '2024-01-01',
    genre: 'Test Genre',
    bandMembers: 'Member 1, Member 2',
    label: 'Test Label',
    isBandTogether: true,
    rollingStoneReview: '****',
    youTubeAlbumURL: 'https://www.youtube.com/test',
    imgURL: 'https://www.example.com/test.png',
    albumsSold: 1000000
  };

  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.get('.auth_bttn').click()
    cy.loginToAuth0(
        Cypress.env('auth0_username'),
        Cypress.env('auth0_password')
    )
    cy.intercept('GET', api, {fixture:'postAlbums.json'}).as('getAlbums')
    cy.visit('http://localhost:3000/add-stack');
  });

  it('should fill out and submit the form successfully', () => {
    cy.intercept('POST', 'https://stacks-api-iota.vercel.app/add-stack', {
      statusCode: 201,
      body: newAlbum
    }).as('postAlbum');

    cy.get('input[name="albumName"]').type(newAlbum.albumName);
    cy.get('input[name="artist"]').type(newAlbum.artist);
    cy.get('input[name="releaseDate"]').type(newAlbum.releaseDate);
    cy.get('input[name="genre"]').type(newAlbum.genre);
    cy.get('input[name="label"]').type(newAlbum.label);
    cy.get('input[name="rollingStoneReview"]').type(newAlbum.rollingStoneReview);
    cy.get('input[name="youTubeAlbumURL"]').type(newAlbum.youTubeAlbumURL);
    cy.get('input[name="imgURL"]').type(newAlbum.imgURL);
    cy.get('input[name="albumsSold"]').type(newAlbum.albumsSold.toString());
    cy.get('input[name="bandMembers"]').type(newAlbum.bandMembers)
    cy.get('input[name="isBandTogether"]').check();

    cy.get('button[type="submit"]').click();

    cy.wait('@postAlbum').its('response.statusCode').should('eq', 201);
    cy.get('.album-cards').should('have.length', 4)

  });

  it('should show an error message on form submission failure', () => {
    cy.intercept('POST', 'https://stacks-api-iota.vercel.app/add-stack', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('postAlbumError');

    cy.get('input[name="albumName"]').type(newAlbum.albumName);
    cy.get('input[name="artist"]').type(newAlbum.artist);
    cy.get('input[name="releaseDate"]').type(newAlbum.releaseDate);
    cy.get('input[name="genre"]').type(newAlbum.genre);
    cy.get('input[name="label"]').type(newAlbum.label);
    cy.get('input[name="rollingStoneReview"]').type(newAlbum.rollingStoneReview);
    cy.get('input[name="youTubeAlbumURL"]').type(newAlbum.youTubeAlbumURL);
    cy.get('input[name="imgURL"]').type(newAlbum.imgURL);
    cy.get('input[name="albumsSold"]').type(newAlbum.albumsSold.toString());
    cy.get('input[name="bandMembers"]').type(newAlbum.bandMembers)
    cy.get('input[name="isBandTogether"]').check();
    cy.get('button[type="submit"]').click();

    cy.wait('@postAlbumError');
    cy.get('.error').should('contain', 'Failed to add album. Please try again.');
  });

  it('should display an error message if required fields are empty', () => {
    cy.intercept('POST', 'https://stacks-api-iota.vercel.app/add-stack', {
      statusCode: 404,
      body: { error: 'Page Not Found' }
    }).as('postAlbumError');
    cy.get('button[type="submit"]').click();
    cy.get('input[required]:first').invoke('prop', 'validationMessage')
      .should('contain', 'Please fill out this field')
  });
});
