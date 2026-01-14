import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonViewDidEnter, IonLoading, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonItem, IonLabel, IonGrid, IonRow, IonCol } from '@ionic/react';
import './Tab3.css';
import { UserInfo } from '../interfaces/UserInfo';
import { useState } from 'react';
import { getUserInfo } from '../services/GithubService';
import { logOutOutline, businessOutline, locationOutline, mailOutline, linkOutline, logoTwitter, calendarOutline, gitBranchOutline, codeWorkingOutline, peopleOutline, personAddOutline } from 'ionicons/icons';
import AuthService from '../services/AuthService';
import { useHistory } from 'react-router';


const Tab3: React.FC = () => {

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const history = useHistory();
  const loadUserInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (err) {
      setError('Error al cargar información del usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    loadUserInfo();
  })

  const handleLogout = () => {
    AuthService.logout();
    // notify app and navigate to login
    window.dispatchEvent(new Event('authChanged'));
    history.replace('/login');
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil de usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Perfil de usuario</IonTitle>
          </IonToolbar>
        </IonHeader>
        {error && <p style={{ color: 'red', padding: '10px' }}>{error}</p>}

        {/* Información básica del usuario */}
        <IonCard>
          <IonCardHeader>
            <img
              alt={userInfo?.name || userInfo?.login}
              src={userInfo?.avatar_url}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                margin: '0 auto',
                display: 'block'
              }}
            />
            <IonCardTitle style={{ textAlign: 'center', marginTop: '10px' }}>
              {userInfo?.name || userInfo?.login}
            </IonCardTitle>
            <IonCardSubtitle style={{ textAlign: 'center' }}>
              @{userInfo?.login}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
              {userInfo?.bio}
            </p>
          </IonCardContent>
        </IonCard>

        {/* Estadísticas */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Estadísticas</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonItem lines="none">
                    <IonIcon icon={gitBranchOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h3>{userInfo?.public_repos}</h3>
                      <p>Repositorios</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
                <IonCol size="6">
                  <IonItem lines="none">
                    <IonIcon icon={codeWorkingOutline} slot="start" color="secondary" />
                    <IonLabel>
                      <h3>{userInfo?.public_gists}</h3>
                      <p>Gists</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol size="6">
                  <IonItem lines="none">
                    <IonIcon icon={peopleOutline} slot="start" color="success" />
                    <IonLabel>
                      <h3>{userInfo?.followers}</h3>
                      <p>Seguidores</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
                <IonCol size="6">
                  <IonItem lines="none">
                    <IonIcon icon={personAddOutline} slot="start" color="warning" />
                    <IonLabel>
                      <h3>{userInfo?.following}</h3>
                      <p>Siguiendo</p>
                    </IonLabel>
                  </IonItem>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        {/* Información adicional */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Información</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {userInfo?.company && (
              <IonItem lines="none">
                <IonIcon icon={businessOutline} slot="start" />
                <IonLabel>
                  <h3>Empresa</h3>
                  <p>{userInfo.company}</p>
                </IonLabel>
              </IonItem>
            )}

            {userInfo?.location && (
              <IonItem lines="none">
                <IonIcon icon={locationOutline} slot="start" />
                <IonLabel>
                  <h3>Ubicación</h3>
                  <p>{userInfo.location}</p>
                </IonLabel>
              </IonItem>
            )}

            {userInfo?.email && (
              <IonItem lines="none">
                <IonIcon icon={mailOutline} slot="start" />
                <IonLabel>
                  <h3>Email</h3>
                  <p>{userInfo.email}</p>
                </IonLabel>
              </IonItem>
            )}

            {userInfo?.blog && (
              <IonItem lines="none">
                <IonIcon icon={linkOutline} slot="start" />
                <IonLabel>
                  <h3>Sitio web</h3>
                  <p>{userInfo.blog}</p>
                </IonLabel>
              </IonItem>
            )}

            {userInfo?.twitter_username && (
              <IonItem lines="none">
                <IonIcon icon={logoTwitter} slot="start" />
                <IonLabel>
                  <h3>Twitter</h3>
                  <p>@{userInfo.twitter_username}</p>
                </IonLabel>
              </IonItem>
            )}

            <IonItem lines="none">
              <IonIcon icon={calendarOutline} slot="start" />
              <IonLabel>
                <h3>Miembro desde</h3>
                <p>{userInfo && userInfo.created_at ? new Date(userInfo.created_at).toLocaleDateString() : ''}</p>
              </IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>
    <IonButton
      expand="block"
      color="danger"
      onClick={handleLogout}
      >
      <IonIcon slot="start" icon={logOutOutline} />
      Cerrar sesión
      


    </IonButton>
    <IonLoading isOpen={loading} message="Cargando información del usuario..." />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;