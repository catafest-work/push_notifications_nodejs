describe('template spec', () => {
  it('passes', () => {
    //cy.visit('http://localhost:3000')
    cy.request('http://localhost:3001')
  })
})
describe('Notification System Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001')
    // Add a small delay to ensure scripts are loaded
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

  // Test the Notification API availability
  it('should have Notification API available', () => {
    cy.window().then((win) => {
      expect(win.Notification).to.exist
    })
  })

  // Test if notifications array exists in the source
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

  // Button Tests
  it('should interact with notification buttons', () => {
    // Test enable notifications button
    cy.get('button').contains('Enable Notifications').should('be.visible')
    cy.get('button').contains('Enable Notifications').click()

    // Test show notification button
    cy.get('button').contains('Show Test Notification').should('be.visible')
    cy.get('button').contains('Show Test Notification').click()
  })

  // Notification Permission Tests
  it('should handle notification permissions', () => {
    cy.window().then((win) => {
      cy.stub(win.Notification, 'requestPermission').resolves('granted')
      cy.get('button').contains('Enable Notifications').click()
    })
  })

  // Popup Notification Tests
  it('should create notification popup', () => {
    cy.window().then((win) => {
      cy.stub(win.Notification, 'permission').value('granted')

      const notificationStub = cy.stub()
      cy.stub(win, 'Notification').as('notificationStub')
          .returns({
            show: notificationStub
          })

      cy.get('button').contains('Show Test Notification').click()

      cy.get('@notificationStub').should('be.called')
      cy.get('@notificationStub').should((stub) => {
        expect(stub.firstCall.args[0]).to.equal('New Alert')
        expect(stub.firstCall.args[1]).to.have.property('requireInteraction', true)
      })
    })
  })

  // Test notification content
  it('should display correct notification content', () => {
    cy.window().then((win) => {
      cy.stub(win.Notification, 'permission').value('granted')

      const notifications = []
      cy.stub(win, 'Notification').callsFake((title, options) => {
        notifications.push({ title, options })
      })

      cy.get('button').contains('Show Test Notification').click()

      cy.wrap(notifications).should('have.length.at.least', 1)
      cy.wrap(notifications[0]).should('deep.include', {
        title: 'New Alert'
      })
    })
  })
})

