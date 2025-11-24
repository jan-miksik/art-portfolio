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
    // Wait for pieces to load (they may load asynchronously)
    cy.get('.pieces', { timeout: 10000 }).should('exist')
  })

  // Note: Testing actual canvas interaction (panning, zooming, clicking pieces)
  // would require more complex setup and may be better suited for component tests
})

