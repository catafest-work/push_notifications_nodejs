describe('template spec', () => {
  it('passes', () => {
    cy.request('http://localhost:3001')
  })
})

describe('Notification System Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001')
    cy.wait(1000)
  })

  it('should load the page successfully', () => {
    cy.get('body').should('exist')
  })

  it('should load notification service script', () => {
    cy.request('/notification_service.js')
        .its('status')
        .should('eq', 200)
  })

  it('should handle server endpoints', () => {
    cy.request('http://localhost:3001')
        .its('status')
        .should('eq', 200)
  })

  it('should have Notification API available', () => {
    cy.window().then((win) => {
      expect(win.Notification).to.exist
    })
  })

  it('should contain notification messages in source', () => {
    cy.request('/notification_service.js')
        .its('body')
        .should('include', 'First notification!')
        .and('include', 'Important update')
  })
})

describe('Notification System Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001')
    cy.wait(1000)
  })

  it('should interact with notification buttons', () => {
    // First verify button exists
    cy.get('[data-test="enable-button"]').should('exist')
    
    // Then force click if needed
    cy.get('[data-test="enable-button"]')
      .invoke('show')
      .click()
  
    cy.get('[data-test="show-button"]')
      .invoke('show')
      .click()
  })

  it('should handle notification permissions', () => {
    cy.window().then((win) => {
      cy.stub(win.Notification, 'requestPermission').resolves('granted')
      cy.get('[data-test="enable-button"]')
        .invoke('show')
        .click({ force: true })
    })
  })

  it('should create notification popup', () => {
    cy.window().then((win) => {
      cy.stub(win.Notification, 'permission').value('granted')

      const notificationStub = cy.stub()
      cy.stub(win, 'Notification').as('notificationStub')
          .returns({
            show: notificationStub
          })

      cy.get('[data-test="show-button"]').click()

      cy.get('@notificationStub').should('be.called')
      cy.get('@notificationStub').should((stub) => {
        expect(stub.firstCall.args[0]).to.equal('New Alert')
        expect(stub.firstCall.args[1]).to.have.property('requireInteraction', true)
      })
    })
  })
  it('should display correct notification content', () => {
    cy.window().then((win) => {
      cy.stub(win.Notification, 'permission').value('granted')
      
      const notifications = []
      cy.stub(win, 'Notification').callsFake((title, options) => {
        notifications.push({ title, options })
        return { title, options }
      })
  
      cy.get('[data-test="show-button"]')
        .invoke('show')
        .click({ force: true })
        
      // Wait for notification to be created
      cy.wrap(notifications, { timeout: 5000 }).should('have.length', 1)
        .then(() => {
          expect(notifications[0].title).to.equal('New Alert')
        })
    })
  })
  
})

describe('Browser Layer Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001')
  })

  it('should display browser information div', () => {
    cy.get('#browser-info').should('exist')
  })

  it('should show original and modified user agent', () => {
    cy.get('#browser-info')
      .find('p')
      .should('have.length', 2)
      .then(($p) => {
        const originalUA = $p[0].textContent
        const modifiedUA = $p[1].textContent
        
        expect(originalUA).to.include('Original User Agent')
        expect(modifiedUA).to.include('Modified User Agent')
        
        if (originalUA.includes('Chrome')) {
          expect(modifiedUA).to.include('Firefox')
        }
      })
  })

  it('should have Firefox specific headers', () => {
    cy.request('http://localhost:3001')
      .its('headers')
      .then((headers) => {
        expect(headers).to.have.property('x-firefox-spoof', 'true')
        expect(headers).to.have.property('accept-language', 'en-US,en;q=0.5')
      })
  })

  it('should load notification service with correct headers', () => {
    cy.request('http://localhost:3001/notification_service.js')
      .then((response) => {
        expect(response.headers['content-type']).to.equal('application/javascript')
        expect(response.headers['x-firefox-spoof']).to.equal('true')
        expect(response.status).to.equal(200)
      })
  })

  it('should verify browser spoofing functionality', () => {
    cy.window().then((win) => {
      const userAgent = win.navigator.userAgent
      if (userAgent.includes('Chrome')) {
        cy.get('#browser-info')
          .should('contain', 'Firefox')
      }
    })
  })
})
