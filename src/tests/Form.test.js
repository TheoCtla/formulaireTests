import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import Form from '../components/Form';
import { calculateAge, isValidPostalCode, isValidName, isValidEmail } from "../utils/validations";
import userEvent from '@testing-library/user-event';
describe('Form component', () => {
    beforeEach(() => {
        // Simule alert() pour éviter les erreurs
        window.alert = jest.fn();
    });
    test('Bouton désactivé si champs vides', () => {
        render(_jsx(Form, {}));
        const button = screen.getByRole('button', { name: /s’enregistrer/i });
        expect(button).toBeDisabled();
    });
    test('calcule correctement l’âge à partir de la date de naissance', () => {
        expect(calculateAge('2000-01-01')).toBeGreaterThan(18);
        expect(calculateAge('2020-01-01')).toBeLessThan(18);
    });
    test('valide le format du code postal français', () => {
        expect(isValidPostalCode('06000')).toBe(true);
        expect(isValidPostalCode('abcde')).toBe(false);
        expect(isValidPostalCode('123')).toBe(false);
        expect(isValidPostalCode('75001')).toBe(true);
    });
    test('valide le format des noms, prénoms et villes', () => {
        expect(isValidName('Jean-Pierre')).toBe(true);
        expect(isValidName('Émilie')).toBe(true);
        expect(isValidName('Nice')).toBe(true);
        expect(isValidName('M@rc')).toBe(false);
        expect(isValidName('123')).toBe(false);
        expect(isValidName('!Ville')).toBe(false);
    });
    test('valide le format de l’email', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name+tag+sorting@example.com')).toBe(true);
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('missing@domain')).toBe(false);
        expect(isValidEmail('missing.com')).toBe(false);
    });
    test('active le bouton quand tous les champs sont valides', async () => {
        render(_jsx(Form, {}));
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/^Nom\s*$/i), 'Durand');
        await user.type(screen.getByLabelText(/^Prénom\s*$/i), 'Claire');
        await user.type(screen.getByLabelText(/email/i), 'claire@example.com');
        await user.type(screen.getByLabelText(/date de naissance/i), '1990-05-05');
        await user.type(screen.getByLabelText(/ville/i), 'Nice');
        await user.type(screen.getByLabelText(/code postal/i), '06000');
        const button = screen.getByRole('button', { name: /s’enregistrer/i });
        expect(button).toBeEnabled();
    });
    test('affiche un toast de succès et vide les champs après soumission', async () => {
        render(_jsx(Form, {}));
        const user = userEvent.setup();
        const nomInput = screen.getByLabelText(/^Nom\s*$/i);
        const prenomInput = screen.getByLabelText(/^Prénom\s*$/i);
        const emailInput = screen.getByLabelText(/email/i);
        const dobInput = screen.getByLabelText(/date de naissance/i);
        const villeInput = screen.getByLabelText(/ville/i);
        const cpInput = screen.getByLabelText(/code postal/i);
        const button = screen.getByRole('button', { name: /s’enregistrer/i });
        await user.type(nomInput, 'Durand');
        await user.type(prenomInput, 'Claire');
        await user.type(emailInput, 'claire@example.com');
        await user.type(dobInput, '1990-05-05');
        await user.type(villeInput, 'Nice');
        await user.type(cpInput, '06000');
        await user.click(button);
        expect(window.alert).toHaveBeenCalledWith('✅ Formulaire enregistré avec succès !');
        expect(nomInput).toHaveValue('');
        expect(prenomInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(dobInput).toHaveValue('');
        expect(villeInput).toHaveValue('');
        expect(cpInput).toHaveValue('');
    });
});
test('affiche les erreurs en rouge sous les champs invalides', async () => {
    render(_jsx(Form, {}));
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^Nom\s*$/i), '123');
    await user.tab();
    await user.type(screen.getByLabelText(/^Prénom\s*$/i), '@Léo');
    await user.tab();
    await user.type(screen.getByLabelText(/email/i), 'invalidemail');
    await user.tab();
    await user.type(screen.getByLabelText(/date de naissance/i), '2020-01-01');
    await user.tab();
    await user.type(screen.getByLabelText(/ville/i), '!Nice');
    await user.tab();
    await user.type(screen.getByLabelText(/code postal/i), 'abc');
    await user.tab();
    await user.click(screen.getByRole('button', { name: /s’enregistrer/i }));
    expect(await screen.findAllByText(/Nom invalide/i)).not.toHaveLength(0);
    expect(screen.getByText(/Prénom invalide/i)).toBeInTheDocument();
    expect(screen.getByText(/Email invalide/i)).toBeInTheDocument();
    expect(screen.getByText(/Vous devez avoir au moins 18 ans/i)).toBeInTheDocument();
    expect(screen.getByText(/Ville invalide/i)).toBeInTheDocument();
    expect(screen.getByText(/Code postal invalide/i)).toBeInTheDocument();
});
