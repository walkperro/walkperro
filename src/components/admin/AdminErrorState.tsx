type AdminErrorStateProps = {
  title?: string;
  message: string;
};

export default function AdminErrorState({
  title = "Admin data is unavailable",
  message,
}: AdminErrorStateProps) {
  return (
    <section className="card">
      <div className="card-inner adminEmpty adminErrorState">
        <p className="adminEyebrow">Configuration error</p>
        <h2 className="adminLeadTitle">{title}</h2>
        <p className="pageMuted">{message}</p>
      </div>
    </section>
  );
}
