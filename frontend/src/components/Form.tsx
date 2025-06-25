import React, { useState, useEffect } from 'react';
import './Form.css';
import {
    isValidName,
    isValidEmail,
    isValidPostalCode,
    isAdult
} from '../utils/validations';
import { API_URL } from '../config';

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    city: string;
    postal_code: string;
};

const Form: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        city: '',
        postalCode: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [userList, setUserList] = useState<User[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const validateFormData = (data: typeof formData) => {
        const newErrors: { [key: string]: string } = {};

        if (!isValidName(data.firstName)) newErrors.firstName = 'Prénom invalide.';
        if (!isValidName(data.lastName)) newErrors.lastName = 'Nom invalide.';
        if (!isValidEmail(data.email)) newErrors.email = 'Email invalide.';
        if (!isAdult(data.birthDate)) newErrors.birthDate = 'Vous devez avoir au moins 18 ans.';
        if (!isValidName(data.city)) newErrors.city = 'Ville invalide.';
        if (!isValidPostalCode(data.postalCode)) newErrors.postalCode = 'Code postal invalide.';

        return newErrors;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };

        setFormData(newFormData);
        const validationErrors = validateFormData(newFormData);
        setErrors(validationErrors);
    };

    const fetchUsers = () => {
        fetch(`${API_URL}/users/`)
            .then(res => res.json())
            .then(data => {
                setUserList(data);
            })
            .catch(err => console.error('Erreur chargement utilisateurs', err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        setSuccessMessage(null);

        const validationErrors = validateFormData(formData);

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch(`${API_URL}/users/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        email: formData.email,
                        birth_date: new Date(formData.birthDate).toISOString().split('T')[0],
                        city: formData.city,
                        postal_code: formData.postalCode
                    }),
                });

                const data = await response.json();

                console.log('DEBUG POST /users/ response:', response.status, data);

                if (response.ok) {
                    await fetchUsers();
                    setSuccessMessage('✅ Formulaire enregistré avec succès !');
                    setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        birthDate: '',
                        city: '',
                        postalCode: ''
                    });
                    setErrors({});
                } else {
                    setSuccessMessage('❌ Erreur lors de l\'envoi des données.');
                }
            } catch (error) {
                console.error('Erreur:', error);
                setSuccessMessage('❌ Une erreur est survenue.');
            }
        } else {
            setErrors(validationErrors);
            setSuccessMessage('❌ Erreurs dans le formulaire. Corrige-les.');
        }
        setIsSubmitting(false);
    };

    const isFormValid = Object.keys(errors).length === 0 && Object.values(formData).every(value => value !== '');

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">Prénom</label>
                    <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} data-cy="firstName" />
                    {errors.firstName && <p data-cy="error-firstName" style={{ color: 'red' }}>{errors.firstName}</p>}
                </div>

                <div>
                    <label htmlFor="lastName">Nom</label>
                    <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} data-cy="lastName" />
                    {errors.lastName && <p data-cy="error-lastName" style={{ color: 'red' }}>{errors.lastName}</p>}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" value={formData.email} onChange={handleChange} data-cy="email" />
                    {errors.email && <p data-cy="error-email" style={{ color: 'red' }}>{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="birthDate">Date de naissance</label>
                    <input id="birthDate" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} data-cy="birthDate" />
                    {errors.birthDate && <p data-cy="error-birthDate" style={{ color: 'red' }}>{errors.birthDate}</p>}
                </div>

                <div>
                    <label htmlFor="city">Ville</label>
                    <input id="city" name="city" value={formData.city} onChange={handleChange} data-cy="city" />
                    {errors.city && <p data-cy="error-city" style={{ color: 'red' }}>{errors.city}</p>}
                </div>

                <div>
                    <label htmlFor="postalCode">Code Postal</label>
                    <input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} data-cy="postalCode" />
                    {errors.postalCode && <p data-cy="error-postalCode" style={{ color: 'red' }}>{errors.postalCode}</p>}
                </div>

                <button type="submit" disabled={!isFormValid || isSubmitting} data-cy="submit">S'enregistrer</button>
            </form>

            {successMessage && <p style={{ color: successMessage.startsWith('✅') ? 'green' : 'red' }}>{successMessage}</p>}

            <h2>Liste des inscrits</h2>
            <ul>
                {userList.map((user) => (
                    <li key={user.id}>
                        {user.first_name} {user.last_name} — {user.email} — {user.city} ({user.postal_code})
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Form;