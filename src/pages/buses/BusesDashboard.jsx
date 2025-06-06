import React, { useState } from "react";
import { Card } from "../../components/ui/card";
import { TruckIcon, StopIcon, ArrowPathIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import api from "../../services/api";

export default function BusesDashboard() {
  const navigate = useNavigate();

  const busesModules = [
    {
      titulo: "Asignar Bus",
      icono: <TruckIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/buses/asignar",
    },
    {
      titulo: "Deshabilitar Bus",
      icono: <StopIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/buses/deshabilitar",
    },
    {
      titulo: "Habilitar Bus",
      icono: <PlayIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/buses/habilitar",
    },
    {
      titulo: "Reasignar Bus",
      icono: <ArrowPathIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/buses/reasignar",
    },
  ];

  // --- Estados para Buses Asignados ---
  const [formData, setFormData] = useState({ Placa: "" });
  const [buses, setBuses] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [busquedaRealizada, setBusquedaRealizada] = useState(false); // <-- Nuevo

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = formData.Placa ? { Placa: formData.Placa } : {};
      const res = await api.post("/Buses/BusesAsignados", body);
      setBuses(res.data);
      setMensaje("Buses encontrados correctamente.");
    } catch (error) {
      console.error("Error al obtener los buses asignados:", error);
      setMensaje("Error al obtener los buses asignados.");
    } finally {
      setBusquedaRealizada(true); // <-- Para saber que ya buscaste
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">

      {/* Header de sección */}
      <h2 className="text-xl font-semibold mb-6">🚍 Gestión de Buses</h2>

      {/* Tarjetas de opciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {busesModules.map((module, idx) => (
          <Link key={idx} to={module.ruta}>
            <Card className="flex items-center justify-between p-6 rounded-2xl border border-[#01ff09] shadow-xl group hover:shadow-2xl transition-shadow">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{module.titulo}</h3>
              </div>
              <div>{module.icono}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Sección de búsqueda de Buses Asignados */}
      <Header titulo="Consultar Buses Asignados" fechaHora={new Date()} />

      <Card>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Placa del Bus"
            name="Placa"
            value={formData.Placa}
            onChange={handleChange}
          />
          <div className="flex justify-end">
            <Button type="submit">Buscar Bus</Button>
          </div>
        </form>
      </Card>

      {/* Mostrar mensaje si existe */}
      {mensaje && <p className="mt-4 text-gray-600">{mensaje}</p>}

      {/* Mostrar tabla solo si ya hiciste una búsqueda */}
      {busquedaRealizada && buses.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <h3 className="font-semibold mb-4">Resultados de Buses Asignados:</h3>
          <table className="min-w-full table-auto bg-white text-black rounded-lg">
            <thead>
              <tr className="bg-[#01ff09] text-white">
                <th className="px-4 py-2">Placa</th>
                <th className="px-4 py-2">Marca</th>
                <th className="px-4 py-2">Modelo</th>
                <th className="px-4 py-2">Ruta</th>
                <th className="px-4 py-2">Piloto</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{bus.placa}</td>
                  <td className="px-4 py-2">{bus.marca}</td>
                  <td className="px-4 py-2">{bus.modelo}</td>
                  <td className="px-4 py-2">{bus.idRuta}</td>
                  <td className="px-4 py-2">{bus.idPiloto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mostrar mensaje si ya buscaste y no hay buses */}
      {busquedaRealizada && buses.length === 0 && (
        <p className="mt-4 text-gray-600">No se encontraron buses asignados.</p>
      )}
    </div>
  );
}
