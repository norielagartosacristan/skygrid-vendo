interface Props {
  title: string;
}

export default function SectionTitle({
  title,
}: Props) {
  return (
    <h2 className="text-xl font-semibold mb-6">
      {title}
    </h2>
  );
}