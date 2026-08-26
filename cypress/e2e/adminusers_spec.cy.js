const users = [
  { id: 1, username: 'kyle boomer', email: 'kylemboomer@gmail.com', role: 'admin' },
  { id: 2, username: 'jane doe', email: 'jane@example.com', role: 'user' },
]

describe('AdminUsersPage — access control', () => {
  beforeEach(() => {
    cy.interceptBackend()
  })

  it('redirects non-admins to /landing without ever showing the table', () => {
    cy.intercept('GET', '**/api/v1/users/me', { body: { role: 'user' } }).as('getUserRole')
    cy.stubGoogleLogin('/admin/users')
    cy.wait('@getUserRole')

    cy.url().should('include', '/landing')
    cy.get('.users-table').should('not.exist')
  })

  it('redirects moderators to /landing (MANAGE_USERS is admin-only)', () => {
    cy.intercept('GET', '**/api/v1/users/me', { body: { role: 'moderator' } }).as('getUserRole')
    cy.stubGoogleLogin('/admin/users')
    cy.wait('@getUserRole')

    cy.url().should('include', '/landing')
  })

  it('shows an error banner when the role fetch itself fails, without loading any user rows', () => {
    cy.intercept('GET', '**/api/v1/users/me', { statusCode: 500, body: {} }).as('getUserRole')
    cy.stubGoogleLogin('/admin/users')
    cy.wait('@getUserRole')

    cy.contains('Could not verify your permissions. Please try again.').should('exist')
    // The table itself always renders once loading resolves (only the error
    // banner above it is conditional) — it's just empty, since getUsers() is
    // never called on this path.
    cy.get('.users-table tbody tr').should('have.length', 0)
  })
})

describe('AdminUsersPage — user management (admin)', () => {
  beforeEach(() => {
    cy.interceptBackend()
    // interceptBackend's default userRole.json fixture is { role: "admin" }.
    cy.intercept('GET', '**/api/v1/users', { body: users }).as('getUsers')
  })

  it('lists every user with their current role selected', () => {
    cy.stubGoogleLogin('/admin/users')
    cy.wait(['@getUserRole', '@getUsers'])

    cy.get('.users-table tbody tr').should('have.length', 2)
    cy.get('.users-table tbody tr').eq(0).find('select').should('have.value', 'admin')
    cy.get('.users-table tbody tr').eq(1).find('select').should('have.value', 'user')
  })

  it("updates a user's role and reflects the change in the dropdown", () => {
    cy.intercept('PATCH', '**/api/v1/users/2/role', { body: { role: 'moderator' } }).as('updateRole')
    cy.stubGoogleLogin('/admin/users')
    cy.wait(['@getUserRole', '@getUsers'])

    cy.get('.users-table tbody tr').eq(1).find('select').select('moderator')
    cy.wait('@updateRole')

    cy.get('.users-table tbody tr').eq(1).find('select').should('have.value', 'moderator')
  })

  it('shows an error banner and reverts the dropdown when a role update fails', () => {
    cy.intercept('PATCH', '**/api/v1/users/2/role', { statusCode: 500, body: { error: 'nope' } }).as('updateRole')
    cy.stubGoogleLogin('/admin/users')
    cy.wait(['@getUserRole', '@getUsers'])

    cy.get('.users-table tbody tr').eq(1).find('select').select('moderator')
    cy.wait('@updateRole')

    cy.contains('Failed to update role. Please try again.').should('exist')
    // The <select> is controlled by user.role in state, which never changed on
    // failure, so it should snap back to the pre-update value rather than
    // silently staying on the user's newly picked option.
    cy.get('.users-table tbody tr').eq(1).find('select').should('have.value', 'user')
  })
})
