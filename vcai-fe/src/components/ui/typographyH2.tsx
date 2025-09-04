interface TypographyH2Props {
  text: string;
  className?: string;
}

export function TypographyH2(props: TypographyH2Props) {
  const { text, className = "" } = props;

  return (
    <h1
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className}`}
    >
      {text}
    </h1>
  );
}
