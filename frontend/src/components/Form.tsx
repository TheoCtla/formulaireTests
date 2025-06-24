import React, { useState, useEffect } from 'react';
import './Form.css';
import {
    isValidName,
    isValidEmail,
    isValidPostalCode,
    isAdult
} from '../utils/validations';

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    city: string;
    postal_code: string;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    const [isFormValid, setIsFormValid] = useState(false);
    const [userList, setUserList] = useState<User[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const allFilled = Object.values(formData).every((val) => val.trim() !== '');
        setIsFormValid(allFilled);
    }, [formData]);

    useEffect(() => {
        fetch(`${API_URL}/users/`)
            .then(res => res.json())
            .then(data => {
                setUserList(data);
            })
            .catch(err => console.error('Erreur chargement utilisateurs', err));
    }, []);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!isValidName(formData.firstName)) newErrors.firstName = 'Prénom invalide.';
        if (!isValidName(formData.lastName)) newErrors.lastName = 'Nom invalide.';
        if (!isValidEmail(formData.email)) newErrors.email = 'Email invalide.';
        if (!isAdult(formData.birthDate)) newErrors.birthDate = 'Vous devez avoir au moins 18 ans.';
        if (!isValidName(formData.city)) newErrors.city = 'Ville invalide.';
        if (!isValidPostalCode(formData.postalCode)) newErrors.postalCode = 'Code postal invalide.';

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const validationErrors = validate();

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
                        birth_date: formData.birthDate,
                        city: formData.city,
                        postal_code: formData.postalCode
                    }),
                });

                if (response.ok) {
                    await fetch(`${API_URL}/users/`)
                        .then(res => res.json())
                        .then(data => setUserList(data));

                    alert('✅ Formulaire enregistré avec succès !');

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
                    alert('❌ Erreur lors de l\'envoi des données.');
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('❌ Une erreur est survenue.');
            }
        } else {
            setErrors(validationErrors);
            alert('❌ Erreurs dans le formulaire. Corrige-les.');
        }
        setIsSubmitting(false);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="firstName">Prénom</label>
                    <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
                    {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
                </div>

                <div>
                    <label htmlFor="lastName">Nom</label>
                    <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
                    {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" value={formData.email} onChange={handleChange} />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="birthDate">Date de naissance</label>
                    <input id="birthDate" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                    {errors.birthDate && <p style={{ color: 'red' }}>{errors.birthDate}</p>}
                </div>

                <div>
                    <label htmlFor="city">Ville</label>
                    <input id="city" name="city" value={formData.city} onChange={handleChange} />
                    {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
                </div>

                <div>
                    <label htmlFor="postalCode">Code Postal</label>
                    <input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                    {errors.postalCode && <p style={{ color: 'red' }}>{errors.postalCode}</p>}
                </div>

                <button type="submit" disabled={!isFormValid || isSubmitting}>S'enregistrer</button>
            </form>

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