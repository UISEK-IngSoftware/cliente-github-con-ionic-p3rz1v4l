import './ExploreContainer.css';

interface ContainerProps {
  name: string;
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>
        Explora los{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://ionicframework.com/docs/components"
        >
          componentes UI de Ionic
        </a>
      </p>
    </div>
  );
};

export default ExploreContainer;
