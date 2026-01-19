import bg from "../../assets/bg-dashboard.jpg";

export default function DashboardBackground({ children }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(${bg})`,
      }}
    >
      <div className="min-h-screen w-full bg-black/70 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
