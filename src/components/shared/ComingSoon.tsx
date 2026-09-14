interface ComingSoonProps {
  heading: string;
  description?: string;
}

// Placeholder body for nav sections that don't have real content yet.
const ComingSoon = ({ heading, description }: ComingSoonProps) => {
  return (
    <section className="py-20 md:py-28 lg:py-[140px]">
      <div className="main-container max-w-[680px] mx-auto text-center space-y-4">
        <h2 className="text-bushwood-700">{heading}</h2>
        <p className="text-primary/70">
          {description ?? "This page is coming soon. In the meantime, give us a call and we'll help you out directly."}
        </p>
      </div>
    </section>
  );
};

export default ComingSoon;
