import React, { useState, useEffect } from 'react';
import './Form.css';
import {
    isValidName,
    isValidEmail,
    isValidPostalCode,
    isAdult
} from '../utils/validations';

type User = {
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    city: string;
    postalCode: string;
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
    const [isFormValid, setIsFormValid] = useState(false);
    const [userList, setUserList] = useState<User[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const allFilled = Object.values(formData).every((val) => val.trim() !== '');
        setIsFormValid(allFilled);
    }, [formData]);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUserList(storedUsers);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length === 0) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push(formData);
            localStorage.setItem('users', JSON.stringify(users));
            setUserList(users);
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
            setErrors(validationErrors);
            alert('❌ Erreurs dans le formulaire. Corrige-les.');
        }
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

                <button type="submit" disabled={!isFormValid}>S’enregistrer</button>
            </form>

            <h2>Liste des inscrits</h2>
            <ul>
                {userList.map((user, index) => (
                    <li key={index}>
                        {user.firstName} {user.lastName} — {user.email} — {user.city} ({user.postalCode})
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Form;