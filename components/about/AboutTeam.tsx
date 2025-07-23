'use client';

import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

export default function AboutTeam() {
  const team = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Kurucu & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: '10+ yıl yazılım geliştirme deneyimi. Önceden fintech ve healthtech alanlarında çalıştı.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'bilgi@diyetup.com'
      }
    },
    {
      name: 'Dr. Elif Kaya',
      role: 'Kurucu & CPO',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Klinik diyetisyeni ve beslenme uzmanı. 8 yıl klinik deneyimi ve ürün geliştirme uzmanlığı.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'bilgi@diyetup.com'
      }
    },
    {
      name: 'Mehmet Demir',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Full-stack geliştirici ve sistem mimarı. Cloud teknolojileri ve güvenlik konularında uzman.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'bilgi@diyetup.com'
      }
    },
    {
      name: 'Zeynep Özkan',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'UX/UI tasarımcısı ve kullanıcı deneyimi uzmanı. Healthcare uygulamaları tasarımında 6 yıl deneyim.',
      social: {
        linkedin: '#',
        twitter: '#',
        email: 'bilgi@diyetup.com'
      }
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ekibimiz
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            DiyetUp'ı hayata geçiren deneyimli ve tutkulu ekibimizle tanışın
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-green-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
              
              <div className="flex justify-center space-x-3">
                <a
                  href={member.social.linkedin}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:shadow-md transition-all duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={member.social.twitter}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:shadow-md transition-all duration-200"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${member.social.email}`}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-green-600 hover:shadow-md transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-green-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ekibimize Katılın</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Sağlık teknolojileri alanında fark yaratmak isteyen yetenekli kişileri arıyoruz. 
              Birlikte daha iyi bir gelecek inşa edelim.
            </p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200">
              Açık Pozisyonları Görün
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}