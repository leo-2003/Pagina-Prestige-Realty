
import React from 'react';
import { BuildingOffice2Icon, UsersIcon, TrophyIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

const AboutPage: React.FC = () => {
  const teamMembers = [
    { name: 'John Doe', role: 'Lead Agent & Founder', imageUrl: 'https://picsum.photos/seed/agent1/400/400' },
    { name: 'Jane Smith', role: 'Senior Agent', imageUrl: 'https://picsum.photos/seed/agent2/400/400' },
    { name: 'Emily White', role: 'Marketing Director', imageUrl: 'https://picsum.photos/seed/agent3/400/400' },
    { name: 'Michael Brown', role: 'Client Relations', imageUrl: 'https://picsum.photos/seed/agent4/400/400' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-800 py-32 px-6 sm:py-40 sm:px-8 lg:px-12">
        <div className="absolute inset-0">
          <img className="w-full h-full object-cover" src="https://picsum.photos/seed/about-hero/1920/1080" alt="Office building" />
          <div className="absolute inset-0 bg-gray-800 mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Sobre Prestige Realty</h1>
          <p className="mt-6 text-xl text-indigo-100">
            Construyendo sueños, una casa a la vez. Descubra la historia, la misión y las personas que nos convierten en un líder en el sector inmobiliario.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Historia</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Fundada en 2010, Prestige Realty comenzó con una idea simple: revolucionar la experiencia de compra y venta de viviendas. Lo que comenzó como una pequeña oficina con un solo agente apasionado ha crecido hasta convertirse en una agencia de primer nivel conocida por su integridad, experiencia y servicio al cliente inquebrantable.
            </p>
            <p className="text-gray-600 leading-relaxed">
              A lo largo de los años, hemos ayudado a cientos de familias a encontrar sus hogares para siempre y a inversores a construir sus carteras. Nuestra base es la confianza y nuestro futuro está impulsado por la innovación y la dedicación a nuestros clientes.
            </p>
          </div>
          <div>
            <img src="https://picsum.photos/seed/our-story/600/400" alt="Team meeting" className="rounded-lg shadow-xl"/>
          </div>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="bg-gray-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid md:grid-cols-2 gap-12">
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <RocketLaunchIcon className="h-12 w-12 mx-auto text-blue-600 mb-4"/>
            <h3 className="text-2xl font-bold mb-2">Nuestra Misión</h3>
            <p className="text-gray-600">
              Empoderar a nuestros clientes con el conocimiento y la orientación necesarios para tomar las mejores decisiones inmobiliarias. Nos esforzamos por ofrecer un servicio excepcional y crear relaciones duraderas basadas en la confianza y el respeto mutuo.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-md">
            <TrophyIcon className="h-12 w-12 mx-auto text-blue-600 mb-4"/>
            <h3 className="text-2xl font-bold mb-2">Nuestra Visión</h3>
            <p className="text-gray-600">
              Ser la agencia inmobiliaria más confiable y respetada de nuestra región, reconocida por nuestro profesionalismo, innovación y compromiso con el éxito de nuestros clientes y el bienestar de nuestra comunidad.
            </p>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Conozca a Nuestro Equipo</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Nuestra fortaleza radica en nuestra gente. Conozca a los profesionales dedicados que trabajan incansablemente para hacer realidad sus sueños inmobiliarios.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <img className="w-48 h-48 mx-auto rounded-full object-cover shadow-lg mb-4" src={member.imageUrl} alt={member.name} />
                <h4 className="text-xl font-semibold text-gray-900">{member.name}</h4>
                <p className="text-blue-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
