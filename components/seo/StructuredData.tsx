interface StructuredDataProps {
  data: object | object[];
  className?: string;
}

export function StructuredData({ data, className }: StructuredDataProps) {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      className={className}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}

export default StructuredData;
