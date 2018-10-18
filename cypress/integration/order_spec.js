describe('Order', () => {
  before(() => {
    cy.login();
  });
  after(() => {
    cy.logout();
  });

  it('should create new a order', () => {
    cy.task('fixture', 'order').then(({ poNo, piNo, currency }) => {
      // Open order detail
      cy.visit('/order')
        .getByTestId('newButton')
        .click()
        .url()
        .should('include', 'new');

      // Fill the required fields
      cy.get('input[name="poNo"]')
        .type(poNo)
        .should('have.value', poNo)
        .get('input[name="piNo"]')
        .type(piNo)
        .should('have.value', piNo)
        .get('input[aria-labelledby="currencySearchSelectInput"]')
        .type(currency)
        .should('have.value', currency)
        .wait(400)
        .get('input[aria-labelledby="tagsTagInputs"]')
        .type('{downarrow}{enter}')
        .get('button[data-testid="dashedButton"]')
        .click()
        .wait(1000)
        .get('div[data-testid="partnerCard"]')
        .each($el => {
          cy.wrap($el).click();
        })
        .get('button[data-testid="saveButtonOnSelectExporters"]')
        .click()
        .wait(1000)
        .get('button[data-testid="saveButton"]')
        .click()
        .wait(1000)
        .should('not.exist');

      // Verify the input data is correct after saving
      cy.get('input[name="poNo"]')
        .should('have.value', poNo)
        .get('input[name="piNo"]')
        .should('have.value', piNo)
        .get('input[aria-labelledby="currencySearchSelectInput"]')
        .should('have.value', currency);
    });
  });

  it('should change the order po number', () => {
    cy.visit('/order').wait(1000);
  });
});
