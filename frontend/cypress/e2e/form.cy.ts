/// <reference types="cypress" />

describe('Formulaire d\'inscription', () => {
    const baseUrl = 'http://localhost:3000';

    beforeEach(() => {
        cy.request('POST', 'http://localhost:8000/test/cleanup');
        cy.visit(baseUrl);
        cy.get('[data-cy=firstName]', { timeout: 10000 }).should('be.visible');
    });

    it('S\'inscrire en tant qu\'employé', () => {
        cy.intercept('POST', 'http://localhost:8000/users/').as('createUser');

        cy.get('[data-cy=firstName]').type('John');
        cy.get('[data-cy=lastName]').type('Doe');
        cy.get('[data-cy=email]').type('john.doe@example.com');
        cy.get('[data-cy=birthDate]').type('2000-01-01');
        cy.get('[data-cy=city]').type('Paris');
        cy.get('[data-cy=postalCode]').type('75000');

        cy.get('[data-cy=submit]').should('not.be.disabled').click();

        cy.wait('@createUser').its('response.statusCode').should('eq', 200);

        cy.contains('✅ Formulaire enregistré avec succès !').should('be.visible');
        cy.contains('John Doe — john.doe@example.com — Paris (75000)', { timeout: 4000 }).should('be.visible');
    });

    it('Essayer de s\'inscrire avec des mauvais champs', () => {
        cy.get('[data-cy=firstName]').type('john@doe.com');
        cy.get('[data-cy=lastName]').type('123');
        cy.get('[data-cy=email]').type('john');
        cy.get('[data-cy=birthDate]').type('2010-01-01');
        cy.get('[data-cy=city]').type('456');
        cy.get('[data-cy=postalCode]').type('nice');

        cy.get('[data-cy=submit]').should('not.be.disabled').click();

        // On attend que React affiche les erreurs
        cy.wait(500);

        cy.get('[data-cy=error-firstName]').should('contain', 'Prénom invalide.');
        cy.get('[data-cy=error-email]').should('contain', 'Email invalide.');
        cy.get('[data-cy=error-birthDate]').should('contain', 'Vous devez avoir au moins 18 ans.');

        cy.url().should('eq', `${baseUrl}/`);
        cy.contains('John Doe — john.doe@example.com — Paris (75000)').should('not.exist');
    });

    it('Redirection en cas de fausse URL', () => {
        cy.visit(`${baseUrl}/fake-url`);
        cy.url().should('eq', `${baseUrl}/`);
    });
});