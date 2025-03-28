export const isValidName = (name) => {
    const regex = /^[A-Za-zÀ-ÿ' -]{2,}$/u;
    return regex.test(name);
};
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
export const isValidPostalCode = (code) => {
    return /^[0-9]{5}$/.test(code);
};
export const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};
export const isAdult = (birthDate) => {
    return calculateAge(birthDate) >= 18;
};
