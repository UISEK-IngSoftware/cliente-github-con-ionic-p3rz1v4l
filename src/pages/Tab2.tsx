import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonTextarea, IonToggle, IonButton, IonLoading, IonText } from '@ionic/react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createRepository } from '../services/GithubService';

const Tab2: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name) {
      setError('El nombre del repositorio es requerido');
      return;
    }
    setLoading(true);
    try {
      await createRepository(name, description, isPrivate);
      history.replace('/tab1');
    } catch (err) {
      console.error(err);
      setError('Error al crear el repositorio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleCreate}>
          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput value={name} onIonInput={e => setName(e.detail.value!)} required />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Descripción</IonLabel>
            <IonTextarea value={description} onIonInput={e => setDescription(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel>Privado</IonLabel>
            <IonToggle checked={isPrivate} onIonChange={e => setIsPrivate(e.detail.checked)} slot="end" />
          </IonItem>

          {error && <IonText color="danger">{error}</IonText>}

          <IonButton expand="block" type="submit" disabled={loading} className="ion-margin-top">
            {loading ? 'Creando...' : 'Crear Repositorio'}
          </IonButton>
        </form>
        <IonLoading isOpen={loading} message="Creando repositorio..." />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;