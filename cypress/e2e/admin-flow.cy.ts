describe('Admin Flow', () => {
  beforeEach(() => {
    const cfClientId = Cypress.env('CF_CLIENT_ID')
    const cfClientSecret = Cypress.env('CF_CLIENT_SECRET')
    
    // Intercept all requests to add Cloudflare Access headers
    cy.intercept('**', (req) => {
      if (cfClientId && cfClientSecret) {
        req.headers['CF-Access-Client-Id'] = cfClientId
        req.headers['CF-Access-Client-Secret'] = cfClientSecret
      }
    })
    
    cy.visit('/admin')
  })

  it('should display admin page', () => {
    cy.get('[data-testid="publish-button"]').should('be.visible')
  })

  it('should have a topic selector', () => {
    cy.get('[data-testid="topic-selector"]').should('be.visible')
  })
})

