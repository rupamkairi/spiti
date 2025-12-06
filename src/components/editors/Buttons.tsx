export default function Button(props: {
  onClick: () => void;
  active?: boolean;
  children: string;
}) {
  return (
    <button
      type="button"
      className={`btn btn-xs ${props.active ? "btn-primary" : "btn-ghost"}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
