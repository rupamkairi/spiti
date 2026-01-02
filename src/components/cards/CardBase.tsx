export type CardBaseProps = {
  id: string;
  title: string;
};

export default function CardBase(props: CardBaseProps) {
  return (
    <div className="card bg-secondary text-secondary-content shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body">
        <h3 className="card-title text-base-content">{props.title}</h3>
        <p className="overflow-hidden whitespace-nowrap text-ellipsis text-sm text-base-300">
          {props.id}
        </p>
      </div>
    </div>
  );
}
