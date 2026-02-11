SELECT * FROM especialistas
SELECT * FROM registros_usuarios
SELECT * FROM atenciones_pacientes

CREATE TABLE atenciones_pacientes (
    id SERIAL PRIMARY KEY,
    rut_paciente VARCHAR(12) REFERENCES registros_usuarios(rut),
    fecha_atencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    especialista_id INTEGER REFERENCES especialistas(id)
);

ALTER TABLE registros_usuarios ADD COLUMN reservas_realizadas INTEGER DEFAULT 0;