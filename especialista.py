import psycopg2
import streamlit as st

def cargar_nomina_completa_sanad():
    # DATOS EXTRAÍDOS DEL CATÁLOGO REAL (EMBED_2_DATA.html)
    especialistas = [
{
            "nombre": "María Carolina Fones",
            "profesion": "Psicóloga Universidad del Desarrollo",
            "registro": "Registro N°287422 Superintendencia de Salud",
            "descripcion": "Diplomado en Psiquiatría y Psicología Forense Universidad del Desarrollo. Diplomado en Psicoanálisis Relacional Universidad Católica. Terapeuta en Adicciones.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Distimia (Depresión Persistente)", "Adicciones (alcohol, drogas, ludopatía, internet, redes sociales, videojuegos)", "Pacientes en contexto forense / legal"],
            "tipoTerapia": ["Individual", "Cuidadores / familiares de pacientes crónicos"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)", "Adultos mayores (65+)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/6c6d1b27-8f36-4342-aa17-6936e6d0f00f",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb945ca375f5462fcb8_PsicologaFoto-Carolina_Fones_Caballero.jpeg"
        },
        {
            "nombre": "Francisca Rojas Jamet",
            "profesion": "Psicóloga Universidad de las Américas",
            "registro": "Registro N°687225 Superintendencia de Salud",
            "descripcion": "Profesional con una sólida formación académica en Psicología y Pedagogía en Lenguaje y Comunicación, con experiencia en el trabajo en entornos educativos. Comprometida con el desarrollo integral de los individuos, abordando la salud mental y la educación desde un enfoque colaborativo y multidisciplinario. Terapia psicológica para niños y adultos. Especialista en TEA y diversidad. Atención empática y sin juicios.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Trastorno Obsesivo Compulsivo (TOC)", "Estrés / Estrés Laboral / Burnout", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "TDAH (Niños, Adolescentes, Adultos)", "Dificultades de Aprendizaje", "Trastorno del Espectro Autista (TEA) - nivel leve", "Conductas Autolesivas", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Problemas Familiares", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Orientación Vocacional / Académica", "Sexualidad (disfunciones, orientación, identidad)"],
            "tipoTerapia": ["Individual", "Familias", "Cuidadores / familiares de pacientes crónicos", "Personas LGBTQ+", "Personas neurodivergentes (TEA, TDAH, etc.)"],
            "genero": "Mujer",
            "grupoEtario": ["Niños (0–12 años)", "Adolescentes (13–17 años)", "Adultos jóvenes (18–25 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/a8def84b-70e0-4748-951d-9567e1f82ab4",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb98505845a74513f03_Psico%CC%81logaFoto-Francisca_Rojas_Jamet.jpeg"
        },
        {
            "nombre": "Jose Luis Escalona Muñoz",
            "profesion": "Psicólogo Universidad Viña del Mar",
            "registro": "Registro N°410845 Superintendencia de Salud",
            "descripcion": "Magister en Neurociencias en Universidad de Chile, cursos en neurorehabilitación y técnicas de psicoterapia breve. Realiza evaluación neuropsicológica para detección de demencias y TDAH. En psicología clínica, abordaje de duelo, depresión, ansiedad, traumas y abuso sexual bajo paradigma sistémico constructivista.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "TDAH (Niños, Adolescentes, Adultos)", "Adicciones (alcohol, drogas, ludopatía, internet, redes sociales, videojuegos)", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Conflictos de Pareja / Celos / Infidelidades", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Orientación Vocacional / Académica", "Detección de demencias"],
            "tipoTerapia": ["Individual", "Parejas", "Cuidadores / familiares de pacientes crónicos", "Personas con discapacidad intelectual", "Personas neurodivergentes (TEA, TDAH, etc.)"],
            "genero": "Hombre",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)", "Adultos mayores (65+)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/0ecb63e2-acd8-4061-8012-bc7bdfbb1574",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb98d8fb9b839c8f61f_Psico%CC%81logoFoto-Jose_Escalona_Mun%CC%83oz.jpeg"
        },
        {
            "nombre": "Marcela Salinas Abarca",
            "profesion": "Psicóloga Universidad de Chile",
            "registro": "Registro N°882788 Superintendencia de Salud",
            "descripcion": "Acompaño a adolescentes y adultos en sus procesos terapéuticos, ofreciendo un espacio seguro, cercano y respetuoso. Trabajo desde el enfoque sistémico, integrando lo emocional, familiar y relacional, según las necesidades de cada persona.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Maltrato Psicológico / Físico", "Anorexia Nerviosa", "Bulimia Nerviosa", "Trastorno por Atracón", "Adicciones (alcohol, drogas, ludopatía, internet, redes sociales, videojuegos)", "Conductas Autolesivas", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Conflictos de Pareja / Celos / Infidelidades", "Problemas Familiares", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Problemas de Sueño / Insomnio", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Orientación Vocacional / Académica", "Sexualidad (disfunciones, orientación, identidad)"],
            "tipoTerapia": ["Individual", "Parejas", "Familias", "Personas LGBTQ+", "Pacientes en contexto forense / legal"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)", "Adolescentes (13–17 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/397d4746-4fff-4f1c-8af5-31666be26530",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/6954298a79ffd2dfa2dffdb8_Psico%CC%81logaFoto_Marcela_Salinas_Abarca.jpg"
        },
        {
            "nombre": "Carolina Infante Aravena",
            "profesion": "Psicóloga Universidad Diego Portales",
            "registro": "Registro N°99369 Superintendencia de Salud",
            "descripcion": "Psicóloga clínica de adultos con orientación psicoanalítica, 15 años de experiencia, especializada en trastornos de ansiedad, trastornos del ánimo, trastornos de la personalidad, estrés post traumático, intervenciones en crisis y acompañamiento en procesos de transformación vital profunda. Postítulo en Clínica Psicoanalítica de Adultos, Diplomada en Psicopatología Psicoanalítica y Diplomada en Teoría y Praxis de la Clínica desde Winnicott.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Fobias Específicas (claustrofobia, aracnofobia, agorafobia, fobia social)", "Trastorno Obsesivo Compulsivo (TOC)", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno Bipolar", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "Trastorno del Espectro Autista (TEA) - nivel leve", "Trastorno Límite de la Personalidad (TLP)", "Trastorno Narcisista de la Personalidad", "Trastorno Obsesivo Compulsivo de la Personalidad (diferente de TOC)", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Conflictos de Pareja / Celos / Infidelidades", "Problemas Familiares", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Problemas de Sueño / Insomnio", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Orientación Vocacional / Académica", "Enfermedades crónicas y agudas - Enfermedades raras poco frecuentes y huérfanas"],
            "tipoTerapia": ["Individual", "Cuidadores / familiares de pacientes crónicos", "Personas LGBTQ+"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos (26–64 años)", "Adultos jóvenes (18–25 años)", "Adultos mayores (65+)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/8e5be992-3df8-48d0-acaf-9ded9ae9cd0c",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb975de06dfc89dc5b2_Psico%CC%81logaFoto-Carolina_Infante_Aravena.jpeg"
        },
        {
            "nombre": "Isabel Morales Chabla",
            "profesion": "Psicóloga Universidad de Chile",
            "registro": "Registro N°882766 Superintendencia de Salud",
            "descripcion": "Psicóloga Clínica egresada de la Universidad de Chile, con Diplomado de Postítulo en Psicoterapia Humanista Existencial realizado en la misma casa de estudios, y un curso en Terapia Breve Centrada en Soluciones. Trabajo en temas de gestión emocional, habilidades sociales, dificultades vinculares, experiencias vitales dolorosas, duelo y trauma; todo desde una formulación comprensiva de caso basada en un enfoque humanista-existencial, de TBCS, comprensiva y empática.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Fobias Específicas (claustrofobia, aracnofobia, agorafobia, fobia social)", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Traumas Psicológicos / Pérdidas Traumáticas", "Conductas Autolesivas", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Baja Autoestima / Inseguridad Personal", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Sexualidad (disfunciones, orientación, identidad)"],
            "tipoTerapia": ["Individual", "Personas LGBTQ+"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)", "Adultos mayores (65+)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/22a1b15f-07a6-4c40-bada-778d897a1a68",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb99943a24358caf65d_Psico%CC%81logaFoto-Isabel_Morales_Chabla.jpeg"
        },
        {
            "nombre": "Pablo Martínez Zúñiga",
            "profesion": "Psicólogo Universidad de la Serena",
            "registro": "Registro N°777486 Superintendencia de Salud",
            "descripcion": "Psicólogo clínico y psicoterapeuta online. Trabajo desde un enfoque cognitivo contextual, el cual busca ayudarte a equilibrar la aceptación con el cambio, y a entender y manejar mejor tus emociones, actos y pensamientos.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Distimia (Depresión Persistente)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "TDAH (Niños, Adolescentes, Adultos)", "Trastorno Límite de la Personalidad (TLP)", "Adicciones (alcohol, drogas, ludopatía, internet, redes sociales, videojuegos)", "Conductas Autolesivas", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Baja Autoestima / Inseguridad Personal", "Crecimiento Personal / Desarrollo de Habilidades Sociales"],
            "tipoTerapia": ["Individual", "Parejas", "Personas LGBTQ+", "Personas neurodivergentes (TEA, TDAH, etc.)"],
            "genero": "Hombre",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adolescentes (13–17 años)", "Adultos (26–64 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/bfe2c5b9-23ec-49d6-83fe-9e15aa96de69",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb9d0cdf907b2fd7d7d_Psico%CC%81logoFoto-Pablo_Marti%CC%81nez_Zu%CC%81n%CC%83iga.jpeg"
        },
        {
            "nombre": "Karin Renck Orellana",
            "profesion": "Psicóloga Pontificia Universidad Católica de Chile",
            "registro": "Registro N°268407 Superintendencia de Salud",
            "descripcion": "Experta en psicoterapia breve (modelo sistémico) en temas de estrés, comunicación, relaciones familiares, de pareja y laborales, crisis vital, depresión, trastornos de ánimo, consumo problemático de alcohol y/o drogas, adulto mayor, ansiedad, trastornos de ánimo, pareja, parentalidad, crianza, trastornos de sueño, principalmente. El abordaje es focalizado en base a lo que el paciente quiera tratar",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno Bipolar", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "Trastorno Límite de la Personalidad (TLP)", "Trastorno Narcisista de la Personalidad", "Adicciones (alcohol, drogas, ludopatía, internet, redes sociales, videojuegos)", "Conductas Autolesivas", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Conflictos de Pareja / Celos / Infidelidades", "Problemas Familiares", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Problemas de Sueño / Insomnio", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Sexualidad (disfunciones, orientación, identidad)"],
            "tipoTerapia": ["Individual", "Cuidadores / familiares de pacientes crónicos", "Personas LGBTQ+", "Pacientes en contexto forense / legal"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)", "Adultos mayores (65+)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/deecb583-c649-47e5-9394-e6f20cf57c1f",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb911e6c9fa27d6ed6c_PsicologaFoto-Karin_Renck_Orellana.jpeg"
        },
        {
            "nombre": "Alejandro Gunckel Barría",
            "profesion": "Psicólogo Universidad Pedro de Valdivia",
            "registro": "Registro N°287745 Superintendencia de Salud",
            "descripcion": "Psicólogo Clínico , con mas de 11 años de experiencia. El enfoque de mi trabajo está centrado en el paciente, el cual contempla un enfoque integrativo, combinando herramientas y modelos de distintas corrientes psicológicas. Esta metodología busca adaptarse a la diversidad de personas, desde el valor propio que contiene las individualidades de cada persona, ofreciendo una atención cálida, flexible y personalizada. Especialista en Tea y/o población Neurodivergente Trastornos de ansiedad y del animo, Estrés postraumático / intervención en crisis / trastornos de la personalidad.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Fobias Específicas (claustrofobia, aracnofobia, agorafobia, fobia social)", "Trastorno Obsesivo Compulsivo (TOC)", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno Bipolar", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "Anorexia Nerviosa", "Bulimia Nerviosa", "TDAH (Niños, Adolescentes, Adultos)", "Dificultades de Aprendizaje", "Trastorno del Espectro Autista (TEA) - nivel leve", "Trastorno Límite de la Personalidad (TLP)", "Trastorno Narcisista de la Personalidad", "Trastorno Obsesivo Compulsivo de la Personalidad (diferente de TOC)", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Problemas de Sueño / Insomnio"],
            "tipoTerapia": ["Individual", "Personas neurodivergentes (TEA, TDAH, etc.)"],
            "genero": "Hombre",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)", "Adultos mayores (65+)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/4efddf64-a4ef-4067-a385-0c8740933e53",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb945ca375f5462fc9a_Psico%CC%81logoFoto-Alejandro_Gunkel_Garcia.jpeg"
        },
        {
            "nombre": "Luna Jara de Barca",
            "profesion": "Psicóloga Universidad de Chile",
            "registro": "Registro N°885058 Superintendencia de Salud",
            "descripcion": "Diplomada en el área constructivista cognitiva, enfocada en el trabajo con los significados o creencias que hemos establecado a lo largo de nuestra historia. Tengo experiencia tratando una amplia variedad de casos, desde búsqueda de crecimiento personal hasta trastornos del ánimo, de la personalidad, conducta alimentaria, etc. Además de trabajar con neurodivergencias y mantenerme constantemente actualizada. Ofrezco un espacio de confianza, respeto y confidencialidad, donde trabajaremos como un equipo para dar respuestas y soluciones a tus preocupaciones.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Fobias Específicas (claustrofobia, aracnofobia, agorafobia, fobia social)", "Trastorno Obsesivo Compulsivo (TOC)", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno Bipolar", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "Anorexia Nerviosa", "Bulimia Nerviosa", "Trastorno por Atracón", "TDAH (Niños, Adolescentes, Adultos)", "Dificultades de Aprendizaje", "Trastorno del Espectro Autista (TEA) - nivel leve", "Trastorno Límite de la Personalidad (TLP)", "Trastorno Narcisista de la Personalidad", "Trastorno Obsesivo Compulsivo de la Personalidad (diferente de TOC)", "Conductas Autolesivas", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Conflictos de Pareja / Celos / Infidelidades", "Problemas Familiares", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Problemas de Sueño / Insomnio", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Orientación Vocacional / Académica", "Sexualidad (disfunciones, orientación, identidad)", "Abuso de sustancias en TLP"],
            "tipoTerapia": ["Individual", "Parejas", "Familias", "Cuidadores / familiares de pacientes crónicos", "Personas LGBTQ+", "Personas con discapacidad intelectual", "Personas neurodivergentes (TEA, TDAH, etc.)", "Pacientes en contexto forense / legal"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)", "Adolescentes (13–17 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/a73f0c2e-0eb2-46cf-af5b-a939cea40eb8",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb99c3700d08330f1b8_Psico%CC%81logaFoto-Luna_Jara_De_Barca.jpeg"
        },
        {
            "nombre": "Rommy Sandoval Olmedo",
            "profesion": "Psicóloga Universidad Diego Portales",
            "registro": "Registro N°892200 Superintendencia de Salud",
            "descripcion": "Atención psicoterapéutica individual a personas desde los dieciséis años, desde un enfoque constructivista cognitivo. Considero que es relevante ofrecer un espacio cálido, seguro y cercano, donde cada persona pueda sentirse escuchada y comprendida desde su propia experiencia. He trabajado con diversas temáticas relacionadas a la salud mental, como estrés, ansiedad, depresión, trastornos de la conducta alimentaria, entre otros. Finalmente, considero relevante continuar formándome y actualizando los conocimientos adquiridos.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Fobias Específicas (claustrofobia, aracnofobia, agorafobia, fobia social)", "Trastorno Obsesivo Compulsivo (TOC)", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno Bipolar", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "Anorexia Nerviosa", "Bulimia Nerviosa", "Trastorno por Atracón", "TDAH (Niños, Adolescentes, Adultos)", "Trastorno del Espectro Autista (TEA) - nivel leve", "Trastorno Límite de la Personalidad (TLP)", "Trastorno Narcisista de la Personalidad", "Trastorno Obsesivo Compulsivo de la Personalidad (diferente de TOC)", "Adicciones (alcohol, drogas, ludopatía, internet, redes sociales, videojuegos)", "Conductas Autolesivas", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Conflictos de Pareja / Celos / Infidelidades", "Problemas Familiares", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Problemas de Sueño / Insomnio", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Orientación Vocacional / Académica", "Sexualidad (disfunciones, orientación, identidad)"],
            "tipoTerapia": ["Individual", "Cuidadores / familiares de pacientes crónicos", "Personas LGBTQ+", "Personas neurodivergentes (TEA, TDAH, etc.)"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos (26–64 años)", "Adultos jóvenes (18–25 años)", "Adultos mayores (65+)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/0d7adfd3-d92c-43a5-bba0-d2bb8df9017a",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb971cee230b828efd5_Psico%CC%81logaFoto-Rommy_Sandoval_Olmedo.jpeg"
        },
        {
            "nombre": "Bryan Paredes Ortíz",
            "profesion": "Psicóloga Universidad de las Américas",
            "registro": "Registro N°507914 Superintendencia de Salud",
            "descripcion": "Psicólogo clínico y educacional con 8 años de experiencia, realizó atenciones a niños, niñas, adolescentes, adultos y personas mayores en base a un enfoque integrativo. Mi objetivo como terapeuta es acompañar tu proceso desde el respeto, la empatía y la escucha activa, validando tus emociones sin juzgar. He cursado especializaciones en varias aflicciones emocionales como ansiedad, depresión, bullying escolar, duelo, neurodiversidad, entre otros.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Fobias Específicas (claustrofobia, aracnofobia, agorafobia, fobia social)", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno Bipolar", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Maltrato Psicológico / Físico", "TDAH (Niños, Adolescentes, Adultos)", "Dificultades de Aprendizaje", "Trastorno del Espectro Autista (TEA) - nivel leve", "Trastorno Límite de la Personalidad (TLP)", "Conductas Autolesivas", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Conflictos de Pareja / Celos / Infidelidades", "Problemas Familiares", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Orientación Vocacional / Académica", "Sexualidad (disfunciones, orientación, identidad)"],
            "tipoTerapia": ["Individual", "Familias", "Cuidadores / familiares de pacientes crónicos", "Personas LGBTQ+", "Personas con discapacidad intelectual", "Personas neurodivergentes (TEA, TDAH, etc.)", "Pacientes en contexto forense / legal"],
            "genero": "Hombre",
            "grupoEtario": ["Niños (0–12 años)", "Adolescentes (13–17 años)", "Adultos jóvenes (18–25 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/fba2fb2d-d9cc-4457-913b-110df86d9966",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb9a4057bf2b9f09e99_PsicologoFoto-Bryan_Paredes_Ortiz.jpeg"
        },
        {
            "nombre": "Kevin Mena Andrade",
            "profesion": "Psicólogo Universidad de Tarapacá",
            "registro": "Registro N°760446 Superintendencia de Salud",
            "descripcion": "Atención psicológica clínica: evaluación y tratamiento de la salud mental. Acompañamiento terapéutico personalizado según las necesidades. Enfoque profesional, ético y orientado al bienestar integral de las personas.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Fobias Específicas (claustrofobia, aracnofobia, agorafobia, fobia social)", "Trastorno Obsesivo Compulsivo (TOC)", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Trastorno Bipolar", "Trastorno de Estrés Postraumático (TEPT)", "Traumas Psicológicos / Pérdidas Traumáticas", "Maltrato Psicológico / Físico", "Bulimia Nerviosa", "Trastorno del Espectro Autista (TEA) - nivel leve", "Trastorno Límite de la Personalidad (TLP)", "Trastorno Narcisista de la Personalidad", "Trastorno Obsesivo Compulsivo de la Personalidad (diferente de TOC)", "Adicciones (alcohol, drogas, ludopatía, internet, redes sociales, videojuegos)", "Conductas Autolesivas", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Conflictos de Pareja / Celos / Infidelidades", "Problemas Familiares", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Problemas de Sueño / Insomnio", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Orientación Vocacional / Académica"],
            "tipoTerapia": ["Individual", "Parejas", "Familias", "Cuidadores / familiares de pacientes crónicos", "Personas LGBTQ+", "Personas con discapacidad intelectual", "Personas neurodivergentes (TEA, TDAH, etc.)"],
            "genero": "Hombre",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)", "Adolescentes (13–17 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/648ed2ea-efef-4569-bbc9-283346e20046",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb9f67c19d190032624_PsicologoFoto-Kevin_Mena_Andrade.jpeg"
        },
        {
            "nombre": "Savka Gubelin Morales",
            "profesion": "Psicóloga Universidad Austral de Chile",
            "registro": "Registro Superintendencia de Salud",
            "descripcion": "Psicóloga con experiencia en atención clínica individual y familiar. Trabajo desde un enfoque de Terapia Cognitivo Conductual (TCC) y aplico Terapia de Juego en la intervención con población infantojuvenil.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Estrés / Estrés Laboral / Burnout", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "Trastorno del Espectro Autista (TEA) - nivel leve", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Orientación Vocacional / Académica"],
            "tipoTerapia": ["Individual", "Cuidadores / familiares de pacientes crónicos", "Personas neurodivergentes (TEA, TDAH, etc.)"],
            "genero": "Mujer",
            "grupoEtario": ["Adolescentes (13–17 años)", "Adultos jóvenes (18–25 años)", "Adultos (26–64 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/fd34a2ac-bc38-46d4-842f-7a2325ca1702",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69541fb9c4a5ed344bb723fc_Psico%CC%81logaFoto-Savka_Gubelin_Morales.jpeg"
        },
        {
            "nombre": "Silvia Núñez Mora",
            "profesion": "Psicóloga Universidad La República",
            "registro": "Registro Superintendencia de Salud",
            "descripcion": "Soy psicóloga con experiencia en atención clínica y comunitaria. Acompaño a niños, adolescentes y adultos en procesos de regulación emocional, manejo del estrés, autoestima y desarrollo personal.",
            "motivos": ["Ansiedad Generalizada", "Ataques de Pánico / Crisis de Angustia", "Fobias Específicas (claustrofobia, aracnofobia, agorafobia, fobia social)", "Estrés / Estrés Laboral / Burnout", "Depresión Mayor", "Distimia (Depresión Persistente)", "Traumas Psicológicos / Pérdidas Traumáticas", "Violencia Intrafamiliar (VIF)", "Abuso Sexual / Abusos en la Infancia", "Maltrato Psicológico / Físico", "Trastorno por Atracón", "TDAH (Niños, Adolescentes, Adultos)", "Trastorno del Espectro Autista (TEA) - nivel leve", "Conductas Autolesivas", "Problemas de Ira y Agresividad", "Duelo Normal / Complicado", "Separaciones y Rupturas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Conflictos de Pareja / Celos / Infidelidades", "Dificultades de Crianza", "Baja Autoestima / Inseguridad Personal", "Problemas de Sueño / Insomnio", "Crecimiento Personal / Desarrollo de Habilidades Sociales"],
            "tipoTerapia": ["Individual", "Parejas", "Cuidadores / familiares de pacientes crónicos", "Personas neurodivergentes (TEA, TDAH, etc.)"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/19f90d35-a3c5-4658-a6cd-f89791369432",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69542989a25e926ab5570abb_Psico%CC%81logaFoto_Silvia_Nun%CC%83ez_Mora.jpg"
        },
        {
            "nombre": "Jonathan Ruiz García",
            "profesion": "Psicólogo Universidad de las Américas",
            "registro": "Registro Superintendencia de Salud",
            "descripcion": "Psicólogo clínico con formación en terapia sistémica y estratégica. Experiencia en el trabajo con familias, parejas e individuos. Especialista en resolución de conflictos, comunicación asertiva y manejo de crisis.",
            "motivos": ["Problemas Familiares", "Conflictos de Pareja / Celos / Infidelidades", "Separaciones y Rupturas", "Ansiedad Generalizada", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Estrés / Estrés Laboral / Burnout"],
            "tipoTerapia": ["Individual", "Parejas", "Familias"],
            "genero": "Hombre",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/e23a3282-a24d-4daf-9505-96ee32f4c12f",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/6954227a53e55dd8fee0dcbc_Psico%CC%81logoFoto-Jonathan_Ruiz_Garci%CC%81a.jpg"
        },
        {
            "nombre": "Christopher Villa Dupretts",
            "profesion": "Psicólogo Universidad de Ciencias Sociales ARCIS",
            "registro": "Registro Superintendencia de Salud",
            "descripcion": "Psicólogo clínico con enfoque psicoanalítico. Experiencia en el tratamiento de trastornos de la personalidad, psicosis y neurosis en adultos. Acompañamiento en procesos de autoconocimiento y subjetivación.",
            "motivos": ["Trastorno Límite de la Personalidad (TLP)", "Trastorno Narcisista de la Personalidad", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Ansiedad Generalizada", "Baja Autoestima / Inseguridad Personal"],
            "tipoTerapia": ["Individual"],
            "genero": "Hombre",
            "grupoEtario": ["Adultos (26–64 años)", "Adultos mayores (65+)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/f4aa75a7-dd7b-4b37-836b-112ced3e9422",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/6954227941196bc32a1149e8_Psico%CC%81logoFoto_Christopher_Villa_Dupretts.jpg"
        },
        {
            "nombre": "Macarena Cepeda Ayala",
            "profesion": "Psicóloga Universidad de Chile",
            "registro": "Registro Superintendencia de Salud",
            "descripcion": "Psicóloga Clínica, comprometida con tu bienestar emocional y salud mental. Mi enfoque es humanista-transpersonal, integrando la espiritualidad y el sentido de vida en el proceso terapéutico. Especialista en ansiedad, depresión y crisis existenciales.",
            "motivos": ["Ansiedad Generalizada", "Depresión Mayor", "Ataques de Pánico / Crisis de Angustia", "Duelo Normal / Complicado", "Crecimiento Personal / Desarrollo de Habilidades Sociales"],
            "tipoTerapia": ["Individual"],
            "genero": "Mujer",
            "grupoEtario": ["Adultos jóvenes (18–25 años)", "Adultos (26–64 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/b25598bb-6acf-4af4-8e3c-f3303be94c49",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69542279500939b4cfde1fde_Psico%CC%81logaFoto_Macarena_Cepeda_Ayala.jpg"
        },
        {
            "nombre": "Angelica Garcia Osorio",
            "profesion": "Psicóloga Clínica",
            "registro": "Registro Superintendencia de Salud",
            "descripcion": "Psicóloga clínica especializada en la atención de adolescentes y adultos jóvenes, con un enfoque cercano y comprometido. Su experiencia incluye el acompañamiento terapéutico a jóvenes y el apoyo a familias, integrando estrategias cognitivo-conductuales para promover el bienestar emocional. Además de su práctica clínica, cuenta con sólida formación en evaluación psicométrica y prevención de conducta suicida, brindando un espacio seguro para abordar procesos de duelo, trauma y crisis vitales.",
            "motivos": ["Duelo Normal / Complicado", "Traumas Psicológicos / Pérdidas Traumáticas", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Problemas Familiares", "Conductas Autolesivas", "Dificultades de Crianza", "Ansiedad Generalizada", "Depresión Mayor"],
            "tipoTerapia": ["Individual", "Familias"],
            "genero": "Mujer",
            "grupoEtario": ["Adolescentes (13–17 años)", "Adultos jóvenes (18–25 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/99b22b9c-9b16-457f-9a10-e70d2b1e6076",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/697438624d3bea52c2e4f383_e83030b6d551c78405cbdff37940c0fb_Psico%CC%81logaFoto-Angelica_Garcia_Osorio.jpeg"
        },
        {
            "nombre": "Adolfo Henríquez Valenzuela",
            "profesion": "Psicólogo Pontificia Universidad Católica de Chile",
            "registro": "Registro Superintendencia de Salud",
            "descripcion": "Psicólogo laboral y organizacional con más de una década de experiencia acompañando a personas en momentos de transición y desafío profesional. Su enfoque integra estrategias breves y reflexivas para abordar situaciones de estrés, burnout e incertidumbre vocacional, ayudando a recuperar el bienestar y la claridad en la toma de decisiones.",
            "motivos": ["Estrés / Estrés Laboral / Burnout", "Orientación Vocacional / Académica", "Transiciones Vitales (mudanzas, migración, jubilación, maternidad/paternidad)", "Crecimiento Personal / Desarrollo de Habilidades Sociales", "Ansiedad Generalizada"],
            "tipoTerapia": ["Individual"],
            "genero": "Hombre",
            "grupoEtario": ["Adultos (26–64 años)"],
            "link": "https://beta-sacmed.novacaribe.com/ReservaOnline/11590/parameters/2494/6157/b8ba451f-e9ec-4ee8-a8a9-325140c5b352",
            "foto": "https://cdn.prod.website-files.com/68f677b74ad8262f24254c20/69743862cfe801b9f4be9122_Psico%CC%81logoFoto_Adolfo_Henri%CC%81quez_Valenzuela.jpg"
        }

        # Sigue pegando aquí el resto de objetos que extraigas del script de EMBED_2_DATA.html
    ]

    try:
        db_config = st.secrets["postgres"]
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()

        # Limpiamos para evitar duplicados y reiniciamos el ID
        cur.execute("TRUNCATE TABLE especialistas RESTART IDENTITY;")

        for esp in especialistas:
            query = """
            INSERT INTO especialistas 
            (nombre, profesion, registro, descripcion, foto_url, link_sacmed, genero, tipo_terapia, grupo_etario, motivos_consulta)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            cur.execute(query, (
                esp['nombre'], esp['profesion'], esp['registro'], esp['descripcion'],
                esp['foto'], esp['link'], esp['genero'], 
                esp['tipoTerapia'], esp['grupoEtario'], esp['motivos']
            ))
        
        conn.commit()
        st.success(f"¡Carga masiva completa! {len(especialistas)} especialistas disponibles en sanad.cl.")
        cur.close()
        conn.close()
    except Exception as e:
        st.error(f"Error en carga: {e}")

if __name__ == "__main__":
    cargar_nomina_completa_sanad()