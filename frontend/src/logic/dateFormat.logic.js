import { format, parseISO, isValid } from 'date-fns';

// Función para formatear una fecha a 'dd/MM/yyyy'
export const formatDateToDDMMYYYY = (dateString) => {
    const parsedDate = parseISO(dateString);
    return isValid(parsedDate) ? format(parsedDate, 'dd/MM/yyyy') : '';
};

// Función para convertir una fecha de 'dd/MM/yyyy' a 'yyyy-MM-dd'
export const formatDateToYYYYMMDD = (date) => {
    return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
};
