describe('Formulaire d\'inscription', () => {
    const baseUrl = 'http://localhost:3000';

    beforeEach(() => {
        // Nettoyer la base avant chaque test
        cy.request('POST', 'http://localhost:8000/test/cleanup');
        cy.visit(baseUrl);
    });

    // it('S\'inscrire en tant qu\'employé', () => {
    //     cy.get('input[name="firstName"]').type('John');
    //     cy.get('input[name="lastName"]').type('Doe');
    //     cy.get('input[name="email"]').type('john.doe@example.com');
    //     cy.get('input[name="birthDate"]').type('2000-01-01');
    //     cy.get('input[name="city"]').type('Paris');
    //     cy.get('input[name="postalCode"]').type('75000');
    //     cy.get('button[type="submit"]').click();

    //     cy.get('button[type="submit"]').click();
    //     cy.contains('✅ Formulaire enregistré avec succès !').should('be.visible');
    //     cy.contains('John Doe — john.doe@example.com — Paris (75000)').should('be.visible');
    // });

    // it('Essayer de s\'inscrire avec des mauvais champs', () => {
    //     cy.get('input[name="firstName"]').type('123');
    //     cy.get('input[name="lastName"]').type('Doe');
    //     cy.get('input[name="email"]').type('john.doe@');
    //     cy.get('input[name="birthDate"]').type('2010-01-01');
    //     cy.get('input[name="city"]').type('Paris');
    //     cy.get('input[name="postalCode"]').type('75000');
    //     cy.get('button[type="submit"]').click();

    //     cy.contains('Prénom invalide.');
    //     cy.contains('Email invalide.');
    //     cy.contains('Vous devez avoir au moins 18 ans.');
    //     cy.url().should('eq', `${baseUrl}/`);
    //     cy.contains('John Doe — john.doe@example.com — Paris (75000)').should('not.exist');
    // });

    it('Redirection en cas de fausse URL', () => {
        cy.visit(`${baseUrl}/fake-url`);
        cy.url().should('eq', `${baseUrl}/`);
    });
});