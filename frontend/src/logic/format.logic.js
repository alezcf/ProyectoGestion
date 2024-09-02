export function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
}

export function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debe ser '12'
    
    return `${hours}:${minutes} ${ampm}`;
}

export function formatRut(rut) {
    // Elimina cualquier punto o guion existente
    const cleanRut = rut.replace(/[^\dkK]/g, '');
    
    // Separa el cuerpo del RUT del dígito verificador
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toUpperCase();

    // Formatea el cuerpo del RUT con puntos
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Retorna el RUT formateado con guion antes del dígito verificador
    return `${formattedBody}-${dv}`;
}