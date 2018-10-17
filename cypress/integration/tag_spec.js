const TAG = {
  name: 'test name',
  updatedName: '[updated] test name',
  clonedName: '[cloned] test name',
  description: 'test description',
  color: '#d4f492',
};

describe('Tag', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('new a tag', () => {
    cy.visit('/tags')
      .getByTestId('newButton')
      .click();

    cy.url().should('include', 'new');

    cy.get('input[name="name"]').type(TAG.name);
    cy.get('textarea[name="description"]').type(TAG.description);
    cy.get('input[name="color"]')
      .clear()
      .type(TAG.color);
    cy.getByTestId('orderRadio').click();

    cy.getByTestId('saveButton')
      .click()
      .wait(100)
      .should('not.exist');

    cy.get('input[name="name"]')
      .should('have.value', TAG.name)
      .get('textarea[name="description"]')
      .should('have.value', TAG.description)
      .get('input[name="color"]')
      .should('have.value', TAG.color);
  });

  it('update a tag', () => {
    cy.get('input[name="name"]')
      .clear()
      .blur();
    cy.getByTestId('saveButton').should('be.disabled');
    cy.get('input[name="name"]')
      .type(TAG.updatedName)
      .blur();

    cy.getByTestId('saveButton')
      .click()
      .wait(500)
      .should('not.exist');
  });

  it('clone a tag', () => {
    cy.getByTestId('cloneButton').click();
    cy.url().should('include', 'clone');
    cy.wait(500);
    cy.get('input[name="name"]')
      .clear()
      .type(TAG.clonedName)
      .blur();

    cy.getByTestId('saveButton')
      .click()
      .wait(100)
      .should('not.exist');
  });
});
