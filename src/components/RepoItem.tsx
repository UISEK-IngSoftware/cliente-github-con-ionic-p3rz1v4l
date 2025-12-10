import { RepositoryItem } from '../interfaces/RepositoryItem';
import './RepoItem.css';
import { IonItem, IonLabel, IonThumbnail } from '@ionic/react';


const RepoItem: React.FC<{repo: RepositoryItem}> = ({ repo }) => {
  return (
    <IonItem>

      <IonThumbnail slot="start">
        <img src={repo.imageUrl ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6SMNlahdjSe9FEIyoP1m83ssBFukv5pVvZw&s"} 
        />
      </IonThumbnail>
      <IonLabel>
        <h2>{repo.name}</h2>
        <p>{repo.description}</p>
        <p>Propietario: {repo.owner}</p>
        <p>Lenguaje: {repo.language}</p>
        </IonLabel>
    </IonItem>
  );
};

export default RepoItem;