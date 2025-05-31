import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent } from "../../components/ui/card";
import Header from "../../components/ui/Header";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import api from "../../services/api"; 

export default function CrearUsuarios() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    idEstado: 1,
    idRol: 1,
    nombreUsuario: "",
    contrasena: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    telefono: "",
  });

  const [modalOpen, setModalOpen] = useState(false);

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
      const res = await api.post("/Usuarios/CrearUsuario", formData);
      console.log("Usuario creado: ", res.data);
      setModalOpen(true);
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      alert("Error al crear el usuario.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <Header titulo="Crear Usuario" fechaHora={new Date()} />

      {/* Botón de regresar */}
      <div className="mb-4">
        <Button onClick={() => navigate("/usuarios")}>⬅️ Regresar</Button>
      </div>

      {/* Formulario */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre de Usuario"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
            />
            <Input
              label="Contraseña"
              name="contrasena"
              type="password"
              value={formData.contrasena}
              onChange={handleChange}
            />
            <Input
              label="Primer Nombre"
              name="primerNombre"
              value={formData.primerNombre}
              onChange={handleChange}
            />
            <Input
              label="Segundo Nombre"
              name="segundoNombre"
              value={formData.segundoNombre}
              onChange={handleChange}
            />
            <Input
              label="Primer Apellido"
              name="primerApellido"
              value={formData.primerApellido}
              onChange={handleChange}
            />
            <Input
              label="Segundo Apellido"
              name="segundoApellido"
              value={formData.segundoApellido}
              onChange={handleChange}
            />
            <Input
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Teléfono"
              name="telefono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
            />
            <div className="flex justify-end">
              <Button type="submit">Registrar Usuario</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de confirmación */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="¡Usuario Registrado!">
        <p>El usuario ha sido creado correctamente.</p>
        <Button onClick={() => setModalOpen(false)}>Cerrar</Button>
      </Modal>
    </div>
  );
}
