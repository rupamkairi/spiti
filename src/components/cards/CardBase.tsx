export type CardBaseProps = {
  id: string;
  title: string;
};

export default function CardBase(props: CardBaseProps) {
  return (
    <div className="card card-border hover:shadow bg-base-100 ">
      <div className="card-body">
        <p>{props.title}</p>
        <p className="overflow-hidden whitespace-nowrap text-ellipsis link link-primary">
          {props.id}
        </p>
      </div>
    </div>
  );
}
