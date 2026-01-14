import {
  IonItem,
  IonLabel,
  IonThumbnail,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/react';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { RepositoryItem } from '../interfaces/RepositoryItem';
import './RepoItem.css';

interface Props {
  repo: RepositoryItem;
  onDelete?: () => void;
  onEdit?: () => void;
  onView?: () => void;
}

const RepoItem: React.FC<Props> = ({ repo, onDelete, onEdit, onView }) => {
  return (
    <IonItemSliding>
      <IonItem button onClick={onView}>
        <IonThumbnail slot="start">
          <img
            src={
              repo.imageUrl ??
              'https://static.vecteezy.com/system/resources/previews/005/544/718/original/icon-image-not-found-free-vector.jpg'
            }
            alt={repo.name}
          />
        </IonThumbnail>

        <IonLabel>
          <h2>{repo.name}</h2>
          <p>{repo.description}</p>
          <p>Propietario: {repo.owner}</p>
          <p>Lenguaje: {repo.language}</p>
        </IonLabel>
      </IonItem>

      <IonItemOptions side="end">
        <IonItemOption color="warning" onClick={onEdit}>
          <IonIcon icon={pencilOutline} />
        </IonItemOption>
        <IonItemOption color="danger" onClick={onDelete}>
          <IonIcon icon={trashOutline} />
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default RepoItem;
