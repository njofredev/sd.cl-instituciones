// ============================================
// SANAD — Datos de Ejemplo (Prototipo)
// ============================================

export const MOCK_DATA = {
    instituciones: [
        {
            id: 'inst-001', nombre: 'Universidad Andina', rut: '76.100.200-3',
            tipo: 'Universidad', logo_url: null, activo: true,
            fecha_inicio_convenio: '2025-03-01', fecha_fin_convenio: '2026-12-31',
            max_sedes: 5, max_usuarios: 50
        },
        {
            id: 'inst-002', nombre: 'Fundación Esperanza', rut: '71.500.300-1',
            tipo: 'Fundación', logo_url: null, activo: true,
            fecha_inicio_convenio: '2025-06-15', fecha_fin_convenio: null,
            max_sedes: 3, max_usuarios: 20
        }
    ],

    sedes: [
        { id: 'sede-001', institucion_id: 'inst-001', nombre: 'Sede Santiago Centro', direccion: 'Av. Libertador 1234', ciudad: 'Santiago', region: 'Metropolitana', activa: true },
        { id: 'sede-002', institucion_id: 'inst-001', nombre: 'Sede Providencia', direccion: 'Av. Providencia 2050', ciudad: 'Providencia', region: 'Metropolitana', activa: true },
        { id: 'sede-003', institucion_id: 'inst-002', nombre: 'Sede Valparaíso', direccion: 'Calle Errázuriz 980', ciudad: 'Valparaíso', region: 'Valparaíso', activa: true },
    ],

    convenios: [
        { id: 'conv-001', institucion_id: 'inst-001', fecha_inicio: '2026-03-01', fecha_fin: '2026-12-31', total_horas: 3150, horas_usadas: 2113, sesiones_por_paciente: 4, duracion_sesion_min: 50, activo: true },
        { id: 'conv-002', institucion_id: 'inst-002', fecha_inicio: '2026-01-15', fecha_fin: '2026-11-30', total_horas: 1500, horas_usadas: 450, sesiones_por_paciente: 6, duracion_sesion_min: 50, activo: true }
    ],

    usuarios_institucionales: [
        { id: 'usr-001', nombre: 'Diego', apellido: 'Martínez', email: 'admin@sanad.cl', password_hash: 'admin123', rol: 'admin_sistema', acceso: 'general', institucion_id: null, sede_ids: [], activo: true },
        { id: 'usr-002', nombre: 'Juan', apellido: 'Pérez Sánchez', email: 'jperez@uandina.cl', password_hash: 'matriz123', rol: 'administrativo', acceso: 'general', institucion_id: 'inst-001', sede_ids: [], activo: true },
        { id: 'usr-003', nombre: 'Marcela', apellido: 'López Figueroa', email: 'mlopez@uandina.cl', password_hash: 'sede123', rol: 'administrativo', acceso: 'limitado', institucion_id: 'inst-001', sede_ids: ['sede-001'], activo: true },
        { id: 'usr-004', nombre: 'Carolina', apellido: 'González Muñoz', email: 'c.gonzalez@uandina.cl', password_hash: 'clinico123', rol: 'clinico', acceso: 'general', institucion_id: 'inst-001', sede_ids: [], activo: true },
        { id: 'usr-005', nombre: 'Roberto', apellido: 'Morales Castro', email: 'rmorales@uandina.cl', password_hash: 'admin123', rol: 'clinico', acceso: 'limitado', institucion_id: 'inst-001', sede_ids: ['sede-001'], activo: true }
    ],

    cuotas_mensuales: [
        { id: 'cuota-001', convenio_id: 'conv-001', mes: '2026-03-01', horas_asignadas: 300, horas_consumidas: 276 },
        { id: 'cuota-002', convenio_id: 'conv-002', mes: '2026-03-01', horas_asignadas: 150, horas_consumidas: 45 }
    ],

    // Real professionals from SANAD database
    profesionales: [
        {
            id: 'prof-001', nombre: 'María Carolina', apellido: 'Fones',
            titulo: 'Psicóloga', universidad: 'Universidad del Desarrollo',
            especialidad: 'Psicología Clínica',
            registro: 'Registro N°287422 Superintendencia de Salud',
            descripcion: 'Diplomado en Psiquiatría y Psicología Forense. Diplomado en Psicoanálisis Relacional. Terapeuta en Adicciones.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Cuidadores / familiares'],
            grupoEtario: ['Adultos jóvenes (18–25)', 'Adultos (26–64)', 'Adultos mayores (65+)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb945ca375f5462fcb8_PsicologaFoto-Carolina_Fones_Caballero.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/6c6d1b27-8f36-4342-aa17-6936e6d0f00f',
            sede_id: 'sede-001', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Vie', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
        },
        {
            id: 'prof-002', nombre: 'Francisca', apellido: 'Rojas Jamet',
            titulo: 'Psicóloga', universidad: 'Universidad de las Américas',
            especialidad: 'Psicología Clínica y Educacional',
            registro: 'Registro N°687225 Superintendencia de Salud',
            descripcion: 'Formación en Psicología y Pedagogía. Especialista en TEA y diversidad. Atención empática y sin juicios.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Familias', 'Personas LGBTQ+', 'Personas neurodivergentes'],
            grupoEtario: ['Niños (0–12)', 'Adolescentes (13–17)', 'Adultos jóvenes (18–25)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb98505845a74513f03_Psico%CC%81logaFoto-Francisca_Rojas_Jamet.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/a8def84b-70e0-4748-951d-9567e1f82ab4',
            sede_id: 'sede-001', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Jue', horarios: ['09:00', '10:00', '11:00', '15:00', '16:00']
        },
        {
            id: 'prof-003', nombre: 'Jose Luis', apellido: 'Escalona Muñoz',
            titulo: 'Psicólogo', universidad: 'Universidad Viña del Mar',
            especialidad: 'Neuropsicología y Psicología Clínica',
            registro: 'Registro N°410845 Superintendencia de Salud',
            descripcion: 'Magister en Neurociencias U. de Chile. Evaluación neuropsicológica, detección de demencias y TDAH. Abordaje sistémico constructivista.',
            genero: 'Hombre',
            tipoTerapia: ['Individual', 'Parejas', 'Personas neurodivergentes'],
            grupoEtario: ['Adultos jóvenes (18–25)', 'Adultos (26–64)', 'Adultos mayores (65+)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb98d8fb9b839c8f61f_Psico%CC%81logoFoto-Jose_Escalona_Mun%CC%83oz.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/0ecb63e2-acd8-4061-8012-bc7bdfbb1574',
            sede_id: 'sede-001', institucion_id: 'inst-001',
            disponibilidad: 'Mar-Sáb', horarios: ['10:00', '11:00', '12:00', '14:00', '15:00']
        },
        {
            id: 'prof-004', nombre: 'Marcela', apellido: 'Salinas Abarca',
            titulo: 'Psicóloga', universidad: 'Universidad de Chile',
            especialidad: 'Psicología Sistémica',
            registro: 'Registro N°882788 Superintendencia de Salud',
            descripcion: 'Acompaño a adolescentes y adultos, ofreciendo un espacio seguro, cercano y respetuoso desde enfoque sistémico.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Parejas', 'Familias', 'Personas LGBTQ+'],
            grupoEtario: ['Adolescentes (13–17)', 'Adultos jóvenes (18–25)', 'Adultos (26–64)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/6954298a79ffd2dfa2dffdb8_Psico%CC%81logaFoto_Marcela_Salinas_Abarca.jpg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/397d4746-4fff-4f1c-8af5-31666be26530',
            sede_id: 'sede-001', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Vie', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']
        },
        {
            id: 'prof-005', nombre: 'Carolina', apellido: 'Infante Aravena',
            titulo: 'Psicóloga', universidad: 'Universidad Diego Portales',
            especialidad: 'Psicología Psicoanalítica',
            registro: 'Registro N°99369 Superintendencia de Salud',
            descripcion: '15 años de experiencia. Especializada en trastornos de ansiedad, ánimo, personalidad y estrés post traumático.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Cuidadores / familiares', 'Personas LGBTQ+'],
            grupoEtario: ['Adultos jóvenes (18–25)', 'Adultos (26–64)', 'Adultos mayores (65+)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb975de06dfc89dc5b2_Psico%CC%81logaFoto-Carolina_Infante_Aravena.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/8e5be992-3df8-48d0-acaf-9ded9ae9cd0c',
            sede_id: 'sede-002', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Mié', horarios: ['10:00', '11:00', '12:00', '15:00', '16:00']
        },
        {
            id: 'prof-006', nombre: 'Isabel', apellido: 'Morales Chabla',
            titulo: 'Psicóloga', universidad: 'Universidad de Chile',
            especialidad: 'Psicología Humanista-Existencial',
            registro: 'Registro N°882766 Superintendencia de Salud',
            descripcion: 'Diplomado en Psicoterapia Humanista Existencial y Terapia Breve Centrada en Soluciones.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Personas LGBTQ+'],
            grupoEtario: ['Adultos jóvenes (18–25)', 'Adultos (26–64)', 'Adultos mayores (65+)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb99943a24358caf65d_Psico%CC%81logaFoto-Isabel_Morales_Chabla.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/22a1b15f-07a6-4c40-bada-778d897a1a68',
            sede_id: 'sede-002', institucion_id: 'inst-001',
            disponibilidad: 'Mar-Vie', horarios: ['09:00', '10:00', '14:00', '15:00', '16:00']
        },
        {
            id: 'prof-007', nombre: 'Pablo', apellido: 'Martínez Zúñiga',
            titulo: 'Psicólogo', universidad: 'Universidad de la Serena',
            especialidad: 'Psicología Cognitivo Contextual',
            registro: 'Registro N°777486 Superintendencia de Salud',
            descripcion: 'Psicoterapeuta online. Enfoque cognitivo contextual: equilibrar aceptación con cambio.',
            genero: 'Hombre',
            tipoTerapia: ['Individual', 'Parejas', 'Personas LGBTQ+', 'Personas neurodivergentes'],
            grupoEtario: ['Adolescentes (13–17)', 'Adultos jóvenes (18–25)', 'Adultos (26–64)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb9d0cdf907b2fd7d7d_Psico%CC%81logoFoto-Pablo_Marti%CC%81nez_Zu%CC%81n%CC%83iga.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/bfe2c5b9-23ec-49d6-83fe-9e15aa96de69',
            sede_id: 'sede-001', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Vie', horarios: ['10:00', '11:00', '15:00', '16:00', '17:00']
        },
        {
            id: 'prof-008', nombre: 'Karin', apellido: 'Renck Orellana',
            titulo: 'Psicóloga', universidad: 'Pontificia Universidad Católica de Chile',
            especialidad: 'Psicoterapia Breve Sistémica',
            registro: 'Registro N°268407 Superintendencia de Salud',
            descripcion: 'Experta en psicoterapia breve sistémica: estrés, comunicación, relaciones, crisis vital, depresión, adicciones.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Personas LGBTQ+', 'Pacientes forenses'],
            grupoEtario: ['Adultos jóvenes (18–25)', 'Adultos (26–64)', 'Adultos mayores (65+)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb911e6c9fa27d6ed6c_PsicologaFoto-Karin_Renck_Orellana.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/deecb583-c649-47e5-9394-e6f20cf57c1f',
            sede_id: 'sede-002', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Jue', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00']
        },
        {
            id: 'prof-009', nombre: 'Alejandro', apellido: 'Gunckel Barría',
            titulo: 'Psicólogo', universidad: 'Universidad Pedro de Valdivia',
            especialidad: 'Psicología Clínica Integrativa',
            registro: 'Registro N°287745 Superintendencia de Salud',
            descripcion: '11+ años de experiencia. Enfoque integrativo, atención cálida, flexible y personalizada. Especialista en TEA y neurodivergencia.',
            genero: 'Hombre',
            tipoTerapia: ['Individual', 'Personas neurodivergentes'],
            grupoEtario: ['Adultos jóvenes (18–25)', 'Adultos (26–64)', 'Adultos mayores (65+)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb945ca375f5462fc9a_Psico%CC%81logoFoto-Alejandro_Gunkel_Garcia.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/4efddf64-a4ef-4067-a385-0c8740933e53',
            sede_id: 'sede-003', institucion_id: 'inst-002',
            disponibilidad: 'Mar-Sáb', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
        },
        {
            id: 'prof-010', nombre: 'Luna', apellido: 'Jara de Barca',
            titulo: 'Psicóloga', universidad: 'Universidad de Chile',
            especialidad: 'Psicología Constructivista Cognitiva',
            registro: 'Registro N°885058 Superintendencia de Salud',
            descripcion: 'Diplomada constructivista cognitiva. Amplia experiencia: trastornos del ánimo, personalidad, conducta alimentaria, neurodivergencias.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Parejas', 'Familias', 'Personas LGBTQ+', 'Personas neurodivergentes'],
            grupoEtario: ['Adolescentes (13–17)', 'Adultos jóvenes (18–25)', 'Adultos (26–64)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb99c3700d08330f1b8_Psico%CC%81logaFoto-Luna_Jara_De_Barca.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/a73f0c2e-0eb2-46cf-af5b-a939cea40eb8',
            sede_id: 'sede-001', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Vie', horarios: ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00']
        },
        {
            id: 'prof-011', nombre: 'Bryan', apellido: 'Paredes Ortíz',
            titulo: 'Psicólogo', universidad: 'Universidad de las Américas',
            especialidad: 'Psicología Clínica y Educacional',
            registro: 'Registro N°507914 Superintendencia de Salud',
            descripcion: '8 años de experiencia, atención integrativa. Especializado en ansiedad, depresión, bullying, neurodiversidad.',
            genero: 'Hombre',
            tipoTerapia: ['Individual', 'Familias', 'Personas LGBTQ+', 'Personas neurodivergentes'],
            grupoEtario: ['Niños (0–12)', 'Adolescentes (13–17)', 'Adultos jóvenes (18–25)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb9a4057bf2b9f09e99_PsicologoFoto-Bryan_Paredes_Ortiz.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/fba2fb2d-d9cc-4457-913b-110df86d9966',
            sede_id: 'sede-003', institucion_id: 'inst-002',
            disponibilidad: 'Lun-Jue', horarios: ['09:00', '10:00', '11:00', '14:00', '15:00']
        },
        {
            id: 'prof-012', nombre: 'Kevin', apellido: 'Mena Andrade',
            titulo: 'Psicólogo', universidad: 'Universidad de Tarapacá',
            especialidad: 'Psicología Clínica',
            registro: 'Registro N°760446 Superintendencia de Salud',
            descripcion: 'Atención clínica: evaluación y tratamiento. Acompañamiento terapéutico personalizado, enfoque ético y orientado al bienestar.',
            genero: 'Hombre',
            tipoTerapia: ['Individual', 'Parejas', 'Familias', 'Personas LGBTQ+', 'Personas neurodivergentes'],
            grupoEtario: ['Adolescentes (13–17)', 'Adultos jóvenes (18–25)', 'Adultos (26–64)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb9f67c19d190032624_PsicologoFoto-Kevin_Mena_Andrade.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/648ed2ea-efef-4569-bbc9-283346e20046',
            sede_id: 'sede-001', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Vie', horarios: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00']
        },
        {
            id: 'prof-013', nombre: 'Savka', apellido: 'Gubelin Morales',
            titulo: 'Psicóloga', universidad: 'Universidad Austral de Chile',
            especialidad: 'TCC y Terapia de Juego',
            registro: 'Registro Superintendencia de Salud',
            descripcion: 'Experiencia en atención clínica individual y familiar. Terapia Cognitivo Conductual y Terapia de Juego infantojuvenil.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Cuidadores / familiares', 'Personas neurodivergentes'],
            grupoEtario: ['Adolescentes (13–17)', 'Adultos jóvenes (18–25)', 'Adultos (26–64)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb9c4a5ed344bb723fc_Psico%CC%81logaFoto-Savka_Gubelin_Morales.jpeg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/fd34a2ac-bc38-46d4-842f-7a2325ca1702',
            sede_id: 'sede-002', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Mié', horarios: ['09:00', '10:00', '14:00', '15:00']
        },
        {
            id: 'prof-014', nombre: 'Silvia', apellido: 'Núñez Mora',
            titulo: 'Psicóloga', universidad: 'Universidad La República',
            especialidad: 'Psicología Clínica y Comunitaria',
            registro: 'Registro Superintendencia de Salud',
            descripcion: 'Experiencia en atención clínica y comunitaria. Regulación emocional, manejo del estrés, autoestima y desarrollo personal.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Parejas', 'Personas neurodivergentes'],
            grupoEtario: ['Adultos jóvenes (18–25)', 'Adultos (26–64)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69542989a25e926ab5570abb_Psico%CC%81logaFoto_Silvia_Nun%CC%83ez_Mora.jpg',
            link: 'https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/19f90d35-a3c5-4658-a6cd-f89791369432',
            sede_id: 'sede-003', institucion_id: 'inst-002',
            disponibilidad: 'Mar-Vie', horarios: ['10:00', '11:00', '14:00', '15:00', '16:00']
        },
        {
            id: 'prof-015', nombre: 'Josefa', apellido: 'Quijanes Carvajal',
            titulo: 'Psicóloga', universidad: 'Universidad de Santiago de Chile',
            especialidad: 'Psicoterapia Humanista-Transpersonal',
            registro: 'Registro N°603472 Superintendencia de Salud',
            descripcion: 'Espacio de cuidado y acompañamiento. Incorpora cuerpo y respiración, recuperando la dimensión espiritual del ser humano.',
            genero: 'Mujer',
            tipoTerapia: ['Individual', 'Familias'],
            grupoEtario: ['Niños (0–12)', 'Adolescentes (13–17)', 'Adultos jóvenes (18–25)', 'Adultos (26–64)'],
            foto: 'https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69990213130a0cf0069835ed_1f476701eb90c5cf4313c08fcd5a5717_Foto_Psicologa-Josefa%20Quijanes%20Carvajal.jpeg',
            link: '',
            sede_id: 'sede-001', institucion_id: 'inst-001',
            disponibilidad: 'Lun-Jue', horarios: ['09:00', '10:00', '11:00', '15:00', '16:00']
        }
    ],

    pacientes_institucionales: [
        { id: 'pac-001', nombre: 'Camila', apellido: 'Reyes Tapia', rut: '18.765.432-1', email: 'camila.reyes@mail.com', telefono: '+56 9 1234 5678', sede_id: 'sede-001', institucion_id: 'inst-001', sesiones_usadas: 3, activo: true, password_hash: 'paciente123' },
        { id: 'pac-002', nombre: 'Tomás', apellido: 'Herrera Lagos', rut: '19.234.567-8', email: 'tomas.herrera@mail.com', telefono: '+56 9 8765 4321', sede_id: 'sede-001', institucion_id: 'inst-001', sesiones_usadas: 4, activo: true, password_hash: 'paciente123' },
        { id: 'pac-003', nombre: 'Sebastián', apellido: 'Díaz Contreras', rut: '20.456.789-0', email: 'sebastian.diaz@mail.com', telefono: '+56 9 5555 1234', sede_id: 'sede-001', institucion_id: 'inst-001', sesiones_usadas: 1, activo: true, password_hash: 'paciente123' },
        { id: 'pac-004', nombre: 'Valentina', apellido: 'Muñoz Ríos', rut: '17.890.123-4', email: 'valentina.munoz@mail.com', telefono: '+56 9 3333 7890', sede_id: 'sede-002', institucion_id: 'inst-001', sesiones_usadas: 2, activo: true, password_hash: 'paciente123' },
        { id: 'pac-005', nombre: 'Matías', apellido: 'Silva Fernández', rut: '21.345.678-5', email: 'matias.silva@mail.com', telefono: '+56 9 4444 5678', sede_id: 'sede-002', institucion_id: 'inst-001', sesiones_usadas: 0, activo: true, password_hash: 'paciente123' },
        { id: 'pac-006', nombre: 'Isidora', apellido: 'Vargas Pinto', rut: '22.567.890-6', email: 'isidora.vargas@mail.com', telefono: '+56 9 6666 2345', sede_id: 'sede-003', institucion_id: 'inst-002', sesiones_usadas: 1, activo: true, password_hash: 'paciente123' },
        { id: 'pac-007', nombre: 'Diego', apellido: 'Rojas Espinoza', rut: '16.789.012-3', email: 'diego.rojas@mail.com', telefono: '+56 9 7777 8901', sede_id: 'sede-003', institucion_id: 'inst-002', sesiones_usadas: 0, activo: false, password_hash: 'paciente123' }
    ],

    citas: [
        // Paciente 1: Varias citas (2 atendidas, 1 ausente, 1 confirmada futura)
        { id: 'cita-001', paciente_id: 'pac-001', profesional_id: 'prof-001', fecha_hora: '2026-03-06T10:00:00', duracion_min: 50, estado: 'confirmada', motivo: 'Ansiedad' },
        { id: 'cita-002', paciente_id: 'pac-001', profesional_id: 'prof-001', fecha_hora: '2026-02-26T10:00:00', duracion_min: 50, estado: 'atendida', motivo: 'Ansiedad' },
        { id: 'cita-003', paciente_id: 'pac-001', profesional_id: 'prof-001', fecha_hora: '2026-02-12T10:00:00', duracion_min: 50, estado: 'atendida', motivo: 'Ansiedad' },
        { id: 'cita-004', paciente_id: 'pac-001', profesional_id: 'prof-003', fecha_hora: '2026-01-15T16:00:00', duracion_min: 50, estado: 'ausente', motivo: 'Ansiedad' },

        // Paciente 2: Terminó sus sesiones (4 atendidas)
        { id: 'cita-005', paciente_id: 'pac-002', profesional_id: 'prof-004', fecha_hora: '2026-03-01T11:00:00', duracion_min: 50, estado: 'atendida', motivo: 'Estrés laboral' },
        { id: 'cita-006', paciente_id: 'pac-002', profesional_id: 'prof-004', fecha_hora: '2026-02-15T11:00:00', duracion_min: 50, estado: 'atendida', motivo: 'Estrés laboral' },
        { id: 'cita-007', paciente_id: 'pac-002', profesional_id: 'prof-004', fecha_hora: '2026-02-01T11:00:00', duracion_min: 50, estado: 'atendida', motivo: 'Estrés laboral' },
        { id: 'cita-008', paciente_id: 'pac-002', profesional_id: 'prof-004', fecha_hora: '2026-01-15T11:00:00', duracion_min: 50, estado: 'atendida', motivo: 'Estrés laboral' },

        // Paciente 3: Reciente, solo 1 confirmada
        { id: 'cita-009', paciente_id: 'pac-003', profesional_id: 'prof-008', fecha_hora: '2026-03-06T15:00:00', duracion_min: 50, estado: 'confirmada', motivo: 'Depresión' },

        // Paciente 4: 1 atendida, 1 agendada
        { id: 'cita-010', paciente_id: 'pac-004', profesional_id: 'prof-010', fecha_hora: '2026-02-28T09:00:00', duracion_min: 50, estado: 'atendida', motivo: 'Problemas de pareja' },
        { id: 'cita-011', paciente_id: 'pac-004', profesional_id: 'prof-010', fecha_hora: '2026-03-07T09:00:00', duracion_min: 50, estado: 'agendada', motivo: 'Problemas de pareja' },

        // Paciente 6: 1 ausente reciente (para que salga en alertas)
        { id: 'cita-012', paciente_id: 'pac-006', profesional_id: 'prof-012', fecha_hora: '2026-03-05T09:00:00', duracion_min: 50, estado: 'ausente', motivo: 'Duelo' },
    ],

    kpis: {
        'todas': { total_pacientes: 7, citas_hoy: 5, citas_semana: 8, asistencia: 82, profesionales_activos: 15 },
        'sede-001': { total_pacientes: 3, citas_hoy: 3, citas_semana: 5, asistencia: 85, profesionales_activos: 8 },
        'sede-002': { total_pacientes: 2, citas_hoy: 1, citas_semana: 2, asistencia: 78, profesionales_activos: 4 },
        'sede-003': { total_pacientes: 2, citas_hoy: 1, citas_semana: 1, asistencia: 80, profesionales_activos: 3 }
    },

    chart_citas_mensual: {
        labels: ['Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar'],
        datasets: {
            'todas': [15, 23, 31, 27, 34, 42, 38],
            'sede-001': [8, 12, 18, 15, 20, 25, 22],
            'sede-002': [4, 6, 8, 7, 9, 12, 10],
            'sede-003': [3, 5, 5, 5, 5, 5, 6]
        }
    },

    chart_asistencia: {
        labels: ['Atendida', 'Ausente', 'Cancelada'],
        data: [72, 18, 10]
    },

    logs_acceso: [
        { usuario: 'Marcela López F.', tipo: 'Admin Sede', accion: 'LOGIN', fecha: '2026-03-05 08:12:30', ip: '192.168.1.42' },
        { usuario: 'Dra. M. Carolina Fones', tipo: 'Clínico', accion: 'LOGIN', fecha: '2026-03-05 09:01:15', ip: '192.168.1.55' },
        { usuario: 'Camila Reyes T.', tipo: 'Paciente', accion: 'LOGIN', fecha: '2026-03-05 09:45:10', ip: '200.14.33.88' },
        { usuario: 'Juan Pérez S.', tipo: 'Admin Matriz', accion: 'LOGOUT', fecha: '2026-03-04 18:30:00', ip: '192.168.1.10' },
        { usuario: 'Roberto Morales C.', tipo: 'Administrativo', accion: 'LOGIN', fecha: '2026-03-04 08:00:22', ip: '192.168.1.67' },
        { usuario: 'Admin Sistema', tipo: 'Sistema', accion: 'CONFIG_CHANGE', fecha: '2026-03-03 14:22:00', ip: '10.0.0.1' },
    ],

    reportes_recientes: [
        { nombre: 'Reporte Mensual Febrero 2026', tipo: 'Actividad', fecha: '2026-03-01', sede: 'Santiago Centro' },
        { nombre: 'Listado Pacientes Activos', tipo: 'CSV', fecha: '2026-02-28', sede: 'Todas las sedes' },
        { nombre: 'Indicadores KPI Q4-2025', tipo: 'Analítica', fecha: '2026-02-15', sede: 'Santiago Centro' },
        { nombre: 'Log de Acceso — Febrero', tipo: 'Auditoría', fecha: '2026-02-28', sede: 'Global' },
    ]
};

export const MOTIVOS_CATALOGO = {
    "Ansiedad nervios y estrés": ["Preocupación constante / no puedo apagar la mente", "Crisis de pánico / crisis de angustia", "Miedos y evitación (lugares salir transporte etc.)", "Miedo a ser juzgado/a (ansiedad social)", "Pensamientos repetitivos y rituales (orden chequeos limpieza)", "Estrés laboral o escolar / burnout", "Síntomas físicos por nervios (palpitaciones tensión mareos)"],
    "Ánimo bajo desmotivación y cambios de humor": ["Tristeza persistente / llanto frecuente", "Me cuesta disfrutar / siento vacío", "Desmotivación / falta de energía", "Irritabilidad sostenida", "Cambios de ánimo intensos", "Periodos de mucha energía y poco sueño", "Ánimo bajo desde hace mucho tiempo"],
    "Experiencias difíciles trauma y violencia": ["Recuerdos/pesadillas por lo vivido", "Me siento en alerta o inseguro/a todo el tiempo", "Evito lugares/personas por algo que pasó", "Dificultad para adaptarme después de un evento", "Violencia en el hogar o en la relación", "Abuso sexual (actual o pasado)", "Maltrato psicológico o físico"],
    "Sueño y malestar físico ligado a lo emocional": ["Insomnio o sueño poco reparador", "Pesadillas frecuentes", "Dolor o molestias físicas asociadas al estrés", "Síntomas físicos sin causa clara (digestivo mareos tensión)"],
    "Alimentación y relación con la comida": ["Restricción alimentaria / miedo a subir de peso", "Atracones / comer sin control", "Vómitos/laxantes/compensaciones", "Culpa o vergüenza intensa al comer / imagen corporal"],
    "Atención aprendizaje y neurodesarrollo": ["Dificultad para concentrarme / distraibilidad", "Problemas de organización y procrastinación", "Dificultades de aprendizaje (lectura/escritura/matemática)", "Dificultades sociales o sensoriales desde siempre", "Dificultades escolares (rendimiento o adaptación)"],
    "Impulsos consumo y conductas que me preocupan": ["Consumo de alcohol o drogas", "Juego/apuestas u otras conductas difíciles de controlar", "Ira/explosividad y conflictos frecuentes", "Autolesiones o pensamientos de hacerme daño"],
    "Relaciones familia pareja y crianza": ["Conflictos de pareja / comunicación / celos / infidelidad", "Problemas familiares o de convivencia", "Dificultades de crianza y límites", "Conflicto entre cuidador/a e hijo/a", "Aislamiento social / falta de red de apoyo"],
    "Duelo separaciones y cambios de vida": ["Duelo por fallecimiento o pérdidas", "Separación o ruptura amorosa", "Migración mudanza o cambio de etapa (jubilación, maternidad/paternidad etc.)"],
    "Autoestima habilidades y crecimiento personal": ["Autoestima baja / inseguridad personal", "Me cuesta poner límites / decir que no", "Habilidades sociales / timidez marcada", "Orientación vocacional o académica"],
    "Sexualidad e intimidad": ["Dificultades en sexualidad o intimidad", "Identidad/orientación y bienestar", "Ansiedad culpa o vergüenza asociada a sexualidad"],
    "Memoria y cambios cognitivos": ["Olvidos frecuentes que afectan el día a día", "Confusión/desorientación o cambios de conducta en persona mayor", "Sospecha o evaluación de demencia"],
    "Acompañamiento emocional por enfermedad médica": ["Afrontamiento emocional de enfermedad crónica/aguda/rara", "Estrés del cuidador/a", "Adherencia a tratamientos y cambios de hábitos"],
    "Evaluación psicológica / informe / orientación": ["Evaluación clínica inicial.", "Informe para contexto educacional/laboral (según pertinencia).", "Orientación vocacional.", "Psicoeducación y plan de apoyo (sin psicoterapia continua).​"]
};