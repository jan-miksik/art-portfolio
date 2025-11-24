describe('Admin Flow', () => {
  beforeEach(() => {
    cy.visit('/admin')
  })

  it('should display admin page', () => {
    cy.get('[data-testid="publish-button"]').should('be.visible')
  })

  it('should have a topic selector', () => {
    cy.get('[data-testid="topic-selector"]').should('be.visible')
  })
})

