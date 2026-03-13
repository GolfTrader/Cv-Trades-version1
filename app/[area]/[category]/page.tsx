interface AreaCategoryPageProps {
  params: {
    area: string;
    category: string;
  };
}

export default function AreaCategoryPage({ params }: AreaCategoryPageProps) {
  const { area, category } = params;

  return (
    <div className="container-page py-10 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Browse trades
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
          {category.replace("-", " ")} in {area}
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Discover trusted local professionals serving the {area} area. Browse
          profiles, read reviews, and find the right expert for your project.
        </p>
      </header>

      <p className="text-sm text-slate-500">
        Listings for this category and area will appear here once Supabase
        integration is added.
      </p>
    </div>
  );
}

