import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './Form.css';
import { isValidName, isValidEmail, isValidPostalCode, isAdult } from '../utils/validations';
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
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        setUserList(storedUsers);
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
    const handleSubmit = (e) => {
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
        }
        else {
            setErrors(validationErrors);
            alert('❌ Erreurs dans le formulaire. Corrige-les.');
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "firstName", children: "Pr\u00E9nom" }), _jsx("input", { id: "firstName", name: "firstName", value: formData.firstName, onChange: handleChange }), errors.firstName && _jsx("p", { style: { color: 'red' }, children: errors.firstName })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "lastName", children: "Nom" }), _jsx("input", { id: "lastName", name: "lastName", value: formData.lastName, onChange: handleChange }), errors.lastName && _jsx("p", { style: { color: 'red' }, children: errors.lastName })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", children: "Email" }), _jsx("input", { id: "email", name: "email", value: formData.email, onChange: handleChange }), errors.email && _jsx("p", { style: { color: 'red' }, children: errors.email })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "birthDate", children: "Date de naissance" }), _jsx("input", { id: "birthDate", type: "date", name: "birthDate", value: formData.birthDate, onChange: handleChange }), errors.birthDate && _jsx("p", { style: { color: 'red' }, children: errors.birthDate })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "city", children: "Ville" }), _jsx("input", { id: "city", name: "city", value: formData.city, onChange: handleChange }), errors.city && _jsx("p", { style: { color: 'red' }, children: errors.city })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "postalCode", children: "Code Postal" }), _jsx("input", { id: "postalCode", name: "postalCode", value: formData.postalCode, onChange: handleChange }), errors.postalCode && _jsx("p", { style: { color: 'red' }, children: errors.postalCode })] }), _jsx("button", { type: "submit", disabled: !isFormValid, children: "S\u2019enregistrer" })] }), _jsx("h2", { children: "Liste des inscrits" }), _jsx("ul", { children: userList.map((user, index) => (_jsxs("li", { children: [user.firstName, " ", user.lastName, " \u2014 ", user.email, " \u2014 ", user.city, " (", user.postalCode, ")"] }, index))) })] }));
};
export default Form;
