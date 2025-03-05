/**
 * Normaliza la estuctura de datos de una petición con datos de usuario para poder procesarlos y validarlos adecuadamente
 * @param {Object} data - Datos que llegan desde la petición con la información del usuario a destructurar 
 * @returns {Array} - Array con 3 elementos, los datos generales del usuario como objeto, el email en la segunda posición y la contraseña en la ultima
 */
export const destructuringUserData = (data) => {
    const {
        role,
        email,
        password,
    } = data;


    return [role, email, password];
};


export const normalizeUserData = (email, password, role) => {
    return {
        email, 
        password,
        role
    };
};


export const normalizeUserPrivateData = (user) => {
    const { id, email, role, createdAt, updatedAt } = user;

    return {
        id,
        email,
        role,  // Include role if needed
        createdAt,
        updatedAt
    };
};