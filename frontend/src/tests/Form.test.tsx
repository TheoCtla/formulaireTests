// src/tests/Form.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from '../components/Form';
import { calculateAge, isValidPostalCode, isValidName, isValidEmail } from "../utils/validations";

jest.mock('../config', () => ({
    API_URL: 'http://mocked-api-url.com'
}));

beforeEach(() => {
    // Mock fetch pour GET /users
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([]),
            ok: true
        })
    ) as jest.Mock;
});

afterEach(() => {
    jest.resetAllMocks();
});

describe('Form component', () => {
    test('renders form fields correctly', () => {
        render(<Form />);

        expect(screen.getByLabelText(/^Prénom$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Nom$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Email$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Date de naissance$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Ville$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Code Postal$/i)).toBeInTheDocument();
    });

    test('calculates age correctly', () => {
        expect(calculateAge('2000-01-01')).toBeGreaterThan(18);
        expect(calculateAge('2020-01-01')).toBeLessThan(18);
    });

    test('validates postal code format', () => {
        expect(isValidPostalCode('06000')).toBe(true);
        expect(isValidPostalCode('abcde')).toBe(false);
        expect(isValidPostalCode('123')).toBe(false);
        expect(isValidPostalCode('75001')).toBe(true);
    });

    test('validates name format', () => {
        expect(isValidName('Jean-Pierre')).toBe(true);
        expect(isValidName('Émilie')).toBe(true);
        expect(isValidName('Nice')).toBe(true);
        expect(isValidName('M@rc')).toBe(false);
        expect(isValidName('123')).toBe(false);
        expect(isValidName('!Ville')).toBe(false);
    });

    test('validates email format', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name+tag+sorting@example.com')).toBe(true);
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('missing@domain')).toBe(false);
        expect(isValidEmail('missing.com')).toBe(false);
    });

    test('submit button is disabled when form is empty', () => {
        render(<Form />);
        const button = screen.getByRole('button', { name: /^s'enregistrer$/i });
        expect(button).toBeDisabled();
    });

    test('enables button when form is valid', async () => {
        render(<Form />);
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/^Nom\s*$/i), 'Durand');
        await user.type(screen.getByLabelText(/^Prénom\s*$/i), 'Claire');
        await user.type(screen.getByLabelText(/email/i), 'claire@example.com');
        await user.type(screen.getByLabelText(/date de naissance/i), '1990-05-05');
        await user.type(screen.getByLabelText(/ville/i), 'Nice');
        await user.type(screen.getByLabelText(/code postal/i), '06000');

        const button = screen.getByRole('button', { name: /^s'enregistrer$/i });
        expect(button).toBeEnabled();
    });

    test('shows success message and resets fields on submit', async () => {
        render(<Form />);
        const user = userEvent.setup();

        const nomInput = screen.getByLabelText(/^Nom$/i);
        const prenomInput = screen.getByLabelText(/^Prénom$/i);
        const emailInput = screen.getByLabelText(/^Email$/i);
        const dobInput = screen.getByLabelText(/^Date de naissance$/i);
        const villeInput = screen.getByLabelText(/^Ville$/i);
        const cpInput = screen.getByLabelText(/^Code Postal$/i);
        const button = screen.getByRole('button', { name: /^s'enregistrer$/i });

        await user.type(nomInput, 'Durand');
        await user.type(prenomInput, 'Claire');
        await user.type(emailInput, 'claire@example.com');
        await user.type(dobInput, '1990-05-05');
        await user.type(villeInput, 'Nice');
        await user.type(cpInput, '06000');

        // 👇 Mock fetch pour POST /users
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'OK' })
            })
        );

        await user.click(button);

        await waitFor(() => {
            expect(screen.getByText(/✅ Formulaire enregistré avec succès/i)).toBeInTheDocument();
        });

        expect(nomInput).toHaveValue('');
        expect(prenomInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(dobInput).toHaveValue('');
        expect(villeInput).toHaveValue('');
        expect(cpInput).toHaveValue('');
    });

    test('displays validation errors under invalid fields', async () => {
        render(<Form />);
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

        await user.click(screen.getByRole('button', { name: /^s'enregistrer$/i }));

        expect(await screen.findByText(/^Nom invalide\.$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Prénom invalide\.$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Email invalide\.$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Vous devez avoir au moins 18 ans\.$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Ville invalide\.$/i)).toBeInTheDocument();
        expect(screen.getByText(/^Code postal invalide\.$/i)).toBeInTheDocument();
    });
});