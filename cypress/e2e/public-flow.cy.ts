describe('Public Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the main page', () => {
    cy.get('body').should('be.visible')
    // Check that the main canvas container is present
    cy.get('.pinch-scroll-zoom').should('exist')
  })

  it('should load pieces on the canvas', () => {
    // Wait for pieces container to be visible
    cy.get('[data-testid="pieces-container"]', { timeout: 10000 }).should('be.visible')
    // Assert that actual piece elements are present inside the container
    cy.get('[data-testid="pieces-container"] .piece', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
  })

  // Note: Testing actual canvas interaction (panning, zooming, clicking pieces)
  // would require more complex setup and may be better suited for component tests
})

