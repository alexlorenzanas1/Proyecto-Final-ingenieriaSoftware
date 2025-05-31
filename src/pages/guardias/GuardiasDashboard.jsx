import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { UserPlusIcon, UserMinusIcon, ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../services/api";

export default function GuardiasDashboard() {
  const [formData, setFormData] = useState({ CUI: "" });
  const [guardias, setGuardias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false); 

  const cargarGuardias = async (CUI = "") => {
    setCargando(true);
    try {
      const body = CUI ? { CUI } : {};
      const res = await api.post("/Guardias/GuardiasAsignados", body);
      setGuardias(res.data);
      setBusquedaRealizada(true); 
    } catch (error) {
      console.error("Error al cargar guardias asignados:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await cargarGuardias(formData.CUI);
  };

  const guardiasModules = [
    {
      titulo: "Deshabilitar Guardia",
      icono: <UserMinusIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/guardias/deshabilitar",
    },
    {
      titulo: "Habilitar Guardia",
      icono: <CheckCircleIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/guardias/habilitar",
    },
    {
      titulo: "Reasignar Guardia",
      icono: <ArrowPathIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/guardias/reasignar",
    },
    {
      titulo: "Registrar Guardia",
      icono: <UserPlusIcon className="w-10 h-10 text-[#01ff09] transform transition-transform duration-300 group-hover:scale-110" />,
      ruta: "/guardias/registrar",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <h2 className="text-xl font-semibold mb-6">🛡️ Gestión de Guardias</h2>

      {/* Tarjetas de acciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {guardiasModules.map((module, idx) => (
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

      {/* Formulario de consulta */}
      <Header titulo="Consultar Guardias Asignados" fechaHora={new Date()} />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="CUI del Guardia"
              name="CUI"
              value={formData.CUI}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Consultar Guardias</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resultados de guardias */}
      {cargando ? (
        <p className="text-gray-600 mt-4">Cargando guardias asignados...</p>
      ) : (
        <>
          {busquedaRealizada && (
            <>
              {guardias.length > 0 ? (
                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full table-auto bg-white text-black rounded-lg">
                    <thead>
                      <tr className="bg-[#01ff09] text-white">
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">CUI</th>
                        <th className="px-4 py-2">Estación</th>
                        <th className="px-4 py-2">Horario</th>
                        <th className="px-4 py-2">Ruta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guardias.map((guardia, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-4 py-2">
                            {guardia.primerNombre} {guardia.segundoNombre} {guardia.primerApellido} {guardia.segundoApellido}
                          </td>
                          <td className="px-4 py-2">{guardia.cui}</td>
                          <td className="px-4 py-2">{guardia.idEstacion}</td>
                          <td className="px-4 py-2">{guardia.idHorario}</td>
                          <td className="px-4 py-2">{guardia.idRuta}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-4 text-gray-600">No se encontraron guardias asignados.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}