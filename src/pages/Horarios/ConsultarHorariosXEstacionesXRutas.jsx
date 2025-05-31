import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function ConsultarHorariosXEstacionesXRutas() {
  const navigate = useNavigate();

  const [horariosEstacionesRutas, setHorariosEstacionesRutas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const consultarHorariosXEstacionesXRutas = async () => {
    setCargando(true);
    try {
      const res = await api.post("/Horarios/HorariosXEstacionesXRutas", {});
      setHorariosEstacionesRutas(res.data);
      setMensaje("✅ Horarios por Estaciones y Rutas consultados correctamente.");
    } catch (error) {
      console.error("Error al consultar horarios por estaciones y rutas:", error);
      setMensaje("❌ Error al consultar horarios por estaciones y rutas.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6">
      
      {/* Botón de regreso */}
      <button
      onClick={() => navigate("/horarios")}
      className="flex items-center gap-2 bg-[#01ff09] text-black font-semibold px-4 py-2 rounded-xl mb-6 hover:bg-[#60ff40] transition-all"
      >
      <span className=" text-white p-1 rounded">⬅️</span> Regresar
      </button>


      {/* Header principal */}
      <Header titulo="🕑 Consultar Horarios x Estaciones x Rutas" fechaHora={new Date()} />

      {/* Botón de Consulta */}
      <Card className="mb-8">
        <CardContent>
          <div className="flex justify-end">
            <Button onClick={consultarHorariosXEstacionesXRutas}>
              Consultar Horarios por Ruta y Estación
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando horarios...</p>
      ) : (
        <>
          {horariosEstacionesRutas.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <h3 className="font-semibold mb-4">Horarios por Estaciones y Rutas:</h3>
              <table className="min-w-full table-auto bg-white text-black rounded-lg">
                <thead>
                  <tr className="bg-[#01ff09] text-white">
                    <th className="px-4 py-2">ID Horario</th>
                    <th className="px-4 py-2">ID Ruta</th>
                    <th className="px-4 py-2">ID Estación</th>
                    <th className="px-4 py-2">Descripción</th>
                    <th className="px-4 py-2">Hora Inicio</th>
                    <th className="px-4 py-2">Hora Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {horariosEstacionesRutas.map((horario, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{horario.idHorario}</td>
                      <td className="px-4 py-2">{horario.idRuta}</td>
                      <td className="px-4 py-2">{horario.idEstacion}</td>
                      <td className="px-4 py-2">{horario.descripcion}</td>
                      <td className="px-4 py-2">{horario.horaInicio}</td>
                      <td className="px-4 py-2">{horario.horaFin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>
          )}
        </>
      )}

    </div>
  );
}
