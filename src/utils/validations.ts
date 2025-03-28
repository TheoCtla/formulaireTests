export const isValidName = (name: string): boolean => {
    const regex = /^[A-Za-zÀ-ÿ' -]{2,}$/u;
    return regex.test(name);
};

export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const isValidPostalCode = (code: string): boolean => {
    return /^[0-9]{5}$/.test(code);
};

export const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export const isAdult = (birthDate: string): boolean => {
    return calculateAge(birthDate) >= 18;
};