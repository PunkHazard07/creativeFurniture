export const SESSION_EXPIRED_EVENT = 'auth: session-expired';

export const handleSessionExpired = () => {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}