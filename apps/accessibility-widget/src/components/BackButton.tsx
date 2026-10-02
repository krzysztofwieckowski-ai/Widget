import { ChevronBackIcon } from './icons';

type Props = { label: string; onClick: () => void };

export default function BackButton({ label, onClick }: Props) {
  return (
    <button type="button" className="button button--secondary" onClick={onClick}>
      <ChevronBackIcon />
      {label}
    </button>
  );
}
