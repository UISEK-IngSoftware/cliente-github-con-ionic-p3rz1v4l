import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonPage, IonText, IonTitle, IonToolbar, IonLoading } from "@ionic/react";
import { logoGithub } from "ionicons/icons";
import './Login.css';
import { useState } from "react";
import AuthService from "../services/AuthService";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {

    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !token) {
        setError('Por favor ingrese su usuario y token de Github.');
        return;
    }
    setLoading(true);
    try {
        const success = AuthService.login(username, token);
        if (success) {
            // notify app about auth change so App can re-render
            window.dispatchEvent(new Event('authChanged'));
            history.replace('/tab1');
        } else {
            setError('Error al Iniciar Session.'); 
        }
    } catch {
        setError('Error al iniciar sesión.');
    } finally {
        setLoading(false);
    }
};


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Iniciar Session</IonTitle>
                    </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-padding">
                <div className="login-container">
                    <IonIcon icon={logoGithub} className="login-logo"/>
                    <h1>Inicio de Session a GitHub</h1>
                    <form className="login-form" onSubmit={handleLogin}>
                    <IonInput
                        className="login-field"
                        label="Usuario de github"
                        labelPlacement="floating"
                        fill="outline"
                        type="text"
                        value={username}
                        onIonInput={e => setUsername(e.detail.value!)}
                        required
                    />


                    <IonInput
                        className="login-field"
                        label="Token de GitHub"
                        labelPlacement="floating"
                        fill="outline"
                        type="password"
                        value={token}
                        onIonInput={e => setToken(e.detail.value!)}
                        required
                    />

                    {error && (
                        <IonText color="danger" className="error-message">
                            {error}
                        </IonText>
                    )}
                    
                        <IonButton expand="block" type="submit" disabled={loading}>
                            {loading ? 'Iniciando...' : 'Iniciar Session'}
                        </IonButton>  
                        <IonText color="medium" className="login-hits">
                            <p>Ingresa tu usuario y token de GitHub.</p>
                        </IonText>
                    </form>
                </div>
                <IonLoading isOpen={loading} message="Iniciando sesión..." />
            </IonContent>
        </IonPage>
    );
}
export default Login;