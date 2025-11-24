describe('Admin Flow', () => {
  beforeEach(() => {
    // Note: In a real scenario, you would need to authenticate via Cloudflare Access
    // For testing, you might need to mock this or use test credentials
    cy.visit('/admin')
  })

  it('should display admin page', () => {
    cy.contains('Publikovat').should('be.visible')
  })

  it('should have a topic selector', () => {
    cy.get('select').should('be.visible')
  })
})

