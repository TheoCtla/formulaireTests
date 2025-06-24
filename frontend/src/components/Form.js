import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './Form.css';
import { isValidName, isValidEmail, isValidPostalCode, isAdult } from '../utils/validations';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const Form = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        city: '',
        postalCode: ''
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [userList, setUserList] = useState([]);
    const handleChange = (e) => {
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
        const newErrors = {};
        if (!isValidName(formData.firstName))
            newErrors.firstName = 'Prénom invalide.';
        if (!isValidName(formData.lastName))
            newErrors.lastName = 'Nom invalide.';
        if (!isValidEmail(formData.email))
            newErrors.email = 'Email invalide.';
        if (!isAdult(formData.birthDate))
            newErrors.birthDate = 'Vous devez avoir au moins 18 ans.';
        if (!isValidName(formData.city))
            newErrors.city = 'Ville invalide.';
        if (!isValidPostalCode(formData.postalCode))
            newErrors.postalCode = 'Code postal invalide.';
        return newErrors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
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
                }
                else {
                    alert('❌ Erreur lors de l\'envoi des données.');
                }
            }
            catch (error) {
                console.error('Erreur:', error);
                alert('❌ Une erreur est survenue.');
            }
        }
        else {
            setErrors(validationErrors);
            alert('❌ Erreurs dans le formulaire. Corrige-les.');
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "firstName", children: "Pr\u00E9nom" }), _jsx("input", { id: "firstName", name: "firstName", value: formData.firstName, onChange: handleChange }), errors.firstName && _jsx("p", { style: { color: 'red' }, children: errors.firstName })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "lastName", children: "Nom" }), _jsx("input", { id: "lastName", name: "lastName", value: formData.lastName, onChange: handleChange }), errors.lastName && _jsx("p", { style: { color: 'red' }, children: errors.lastName })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", value: formData.email, onChange: handleChange }), errors.email && _jsx("p", { style: { color: 'red' }, children: errors.email })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "birthDate", children: "Date de naissance" }), _jsx("input", { id: "birthDate", type: "date", name: "birthDate", value: formData.birthDate, onChange: handleChange }), errors.birthDate && _jsx("p", { style: { color: 'red' }, children: errors.birthDate })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "city", children: "Ville" }), _jsx("input", { id: "city", name: "city", value: formData.city, onChange: handleChange }), errors.city && _jsx("p", { style: { color: 'red' }, children: errors.city })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "postalCode", children: "Code Postal" }), _jsx("input", { id: "postalCode", name: "postalCode", value: formData.postalCode, onChange: handleChange }), errors.postalCode && _jsx("p", { style: { color: 'red' }, children: errors.postalCode })] }), _jsx("button", { type: "submit", disabled: !isFormValid, children: "S\u2019enregistrer" })] }), _jsx("h2", { children: "Liste des inscrits" }), _jsx("ul", { children: userList.map((user) => (_jsxs("li", { children: [user.first_name, " ", user.last_name, " \u2014 ", user.email, " \u2014 ", user.city, " (", user.postal_code, ")"] }, user.id))) })] }));
};
export default Form;
