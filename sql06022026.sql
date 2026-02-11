-- Creación de la tabla de registros
CREATE TABLE IF NOT EXISTS registros_usuarios (
    id SERIAL PRIMARY KEY,
    rut VARCHAR(12) UNIQUE NOT NULL, -- Almacenado como 12345678K
    nombre_completo VARCHAR(255),
    email VARCHAR(100),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Índice para acelerar las búsquedas por RUT
CREATE INDEX idx_rut_busqueda ON registros_usuarios(rut);

-- Datos de prueba (Seed)
INSERT INTO registros_usuarios (rut, nombre_completo, email) 
VALUES ('12345678K', 'Usuario de Prueba', 'contacto@sanad.cl');

ALTER TABLE registros_usuarios 
ADD COLUMN sede VARCHAR(100);

UPDATE registros_usuarios SET sede = 'Sede Central' WHERE sede IS NULL;

select * from registros_usuarios

UPDATE registros_usuarios SET rut = REPLACE(rut, '-', '');

INSERT INTO registros_usuarios (rut, nombre_completo, email, sede) 
VALUES 
('16123456-1', 'Javier Ignacio Morales', 'jmorales@sanad.cl', 'Santiago Centro'),
('15987654-K', 'Valentina Paz Herrera', 'vherrera@sanad.cl', 'Las Condes'),
('17456123-2', 'Roberto Andrés Soto', 'rsoto@sanad.cl', 'Providencia'),
('18321987-9', 'Camila Belén Rojas', 'crojas@sanad.cl', 'Viña del Mar'),
('14789321-7', 'Guillermo Patricio Tapia', 'gtapia@sanad.cl', 'Concepción'),
('19654789-3', 'Francisca Elena Silva', 'fsilva@sanad.cl', 'Antofagasta'),
('13258741-6', 'Mauricio Alejandro Díaz', 'mdiaz@sanad.cl', 'La Serena'),
('20369147-8', 'Antonia Ignacia Castro', 'acastro@sanad.cl', 'Santiago Centro'),
('12456789-K', 'Ricardo Esteban Muñoz', 'rmunoz@sanad.cl', 'Temuco'),
('21987456-2', 'Daniela Sofía Vargas', 'dvargas@sanad.cl', 'Las Condes');

CREATE TABLE IF NOT EXISTS especialistas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    profesion VARCHAR(255),
    registro VARCHAR(100),
    descripcion TEXT,
    foto_url TEXT,
    link_sacmed TEXT,
    genero VARCHAR(50), -- "Mujer", "Hombre" o "Sin preferencia"
    tipo_terapia TEXT[], -- Array: Individual, Parejas, etc.
    grupo_etario TEXT[], -- Array: Niños, Adolescentes, etc.
    motivos_consulta TEXT[], -- Array de motivos específicos
    activo BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_motivos ON especialistas USING GIN (motivos_consulta);
CREATE INDEX idx_grupo_etario ON especialistas USING GIN (grupo_etario);

select * from especialistas
