import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, useIonViewDidEnter, IonLoading, IonAlert, IonModal, IonInput, IonTextarea, IonItem, IonLabel, IonToggle, IonButton, IonButtons } from '@ionic/react';
import { useState } from 'react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import { fetchRepositories, updateRepository, deleteRepository } from '../services/GithubService';


const Tab1: React.FC = () => {

  const [repos, setRepos] = useState<RepositoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingRepo, setEditingRepo] = useState<RepositoryItem | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<RepositoryItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIsPrivate, setEditIsPrivate] = useState(false);

  const loadRepos = async () => {
    setLoading(true);
    setError(null);
    try {
      const reposData = await fetchRepositories();
      setRepos(reposData);
    } catch (err) {
      setError('Error al cargar repositorios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useIonViewDidEnter(() => {
    console.log("IionViewDidEnter - Cargando repositorios");
    loadRepos();
  });

  const handleView = (repo: RepositoryItem) => {
    if (repo.owner && repo.name) {
      window.open(`https://github.com/${repo.owner}/${repo.name}`, '_blank');
    }
  };

  const handleEdit = (repo: RepositoryItem) => {
    setEditingRepo(repo);
    setEditName(repo.name || '');
    setEditDescription(repo.description || '');
    setEditIsPrivate(false);
  };

  const handleDelete = (repo: RepositoryItem) => {
    setRepoToDelete(repo);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (!repoToDelete || !repoToDelete.owner || !repoToDelete.name) return;
    try {
      await deleteRepository(repoToDelete.owner, repoToDelete.name);
      setRepos(repos.filter(r => r.name !== repoToDelete.name));
      setShowDeleteAlert(false);
      setRepoToDelete(null);
    } catch (err) {
      setError('Error al eliminar repositorio');
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editingRepo || !editingRepo.owner || !editingRepo.name) return;
    try {
      const updates: { name?: string; description?: string; isPrivate?: boolean } = {};
      if (editName !== editingRepo.name) updates.name = editName;
      if (editDescription !== (editingRepo.description || '')) updates.description = editDescription;
      updates.isPrivate = editIsPrivate;

      await updateRepository(editingRepo.owner, editingRepo.name, updates);
      setRepos(repos.map(r => r.name === editingRepo.name ? {
        ...r,
        name: editName,
        description: editDescription
      } : r));
      setEditingRepo(null);
      setError(null);
    } catch (err) {
      setError('Error al actualizar repositorio');
      console.error(err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        {error && <p style={{ color: 'red', padding: '10px' }}>{error}</p>}
        <IonList>
          {repos.map((repo) => (
            <RepoItem
              key={`${repo.owner}-${repo.name}`}
              repo={repo}
              onEdit={() => handleEdit(repo)}
              onDelete={() => handleDelete(repo)}
              onView={() => handleView(repo)}
            />
          ))}
        </IonList>
        <IonLoading isOpen={loading} message="Cargando repositorios..." />
        <IonModal isOpen={!!editingRepo} onDidDismiss={() => setEditingRepo(null)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Editar Repositorio</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setEditingRepo(null)}>Cancelar</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonInput
              label="Nombre del Repositorio"
              labelPlacement="floating"
              fill="outline"
              value={editName}
              onIonChange={(e) => setEditName(e.detail.value!)}
              className="ion-margin-bottom"
            />
            <IonTextarea
              label="Descripción"
              labelPlacement="floating"
              fill="outline"
              value={editDescription}
              onIonChange={(e) => setEditDescription(e.detail.value!)}
              rows={4}
              className="ion-margin-bottom"
            />
            <IonItem>
              <IonLabel>Repositorio Privado</IonLabel>
              <IonToggle
                checked={editIsPrivate}
                onIonChange={(e) => setEditIsPrivate(e.detail.checked)}
                slot="end"
              />
            </IonItem>
            <IonButton
              expand="block"
              onClick={handleUpdate}
              className="ion-margin-top"
            >
              Guardar Cambios
            </IonButton>
          </IonContent>
        </IonModal>
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header="Eliminar Repositorio"
          message={`¿Estás seguro de que quieres eliminar ${repoToDelete?.name}?`}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
            },
            {
              text: 'Eliminar',
              role: 'destructive',
              handler: confirmDelete,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
