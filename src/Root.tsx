import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

export const Root = () => {
  return (
    <BrowserRouter>
      <div className="w-full flex justify-center items-center min-h-screen bg-blue-100">
        <div className="w-6/12 text-center p-6 rounded-lg bg-gray-50 shadow-lg">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
