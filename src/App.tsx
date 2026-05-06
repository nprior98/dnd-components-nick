import MainLayout from "./components/MainLayout";
import "./styles/Style.css";
import Router from "./routes";
import background from "/desk_bg.png";

export default function App() {
  return (
    <MainLayout>
      <div
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Router />
      </div>
    </MainLayout>
  );
}
