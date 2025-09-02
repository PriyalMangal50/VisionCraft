import React from 'react'
import Hero from '../components/Hero';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import LatestBlogs from '../components/LatestBlogs';
import NewsletterBox from '../components/NewsletterBox';
import QuizBanner from '../components/QuizBanner';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Home = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed left-0 top-1/4 w-[500px] h-[500px] bg-[#233362] opacity-[0.02] rounded-full -translate-x-1/2 z-0 pointer-events-none"></div>
      <div className="fixed right-0 bottom-1/4 w-[600px] h-[600px] bg-accent-400 opacity-[0.02] rounded-full translate-x-1/2 z-0 pointer-events-none"></div>
      <div className="fixed left-1/4 bottom-0 w-[400px] h-[400px] bg-secondary-500 opacity-[0.02] rounded-full translate-y-1/2 z-0 pointer-events-none"></div>
      
      {/* Page content */}
      <div className="relative z-10">
        <Hero/>

        {/* Featured categories */}
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[{
              title:'Eyeglasses', to:'/collection', state:{filters:{categories:['Eyeglasses']}},
              img: assets.p_img3
            },{
              title:'Sunglasses', to:'/collection', state:{filters:{categories:['Sunglasses']}},
              img: assets.p_img18
            },{
              title:'Contact Lenses', to:'/collection', state:{filters:{categories:['Contact Lenses']}},
              img: assets.p_img31
            }].map((c,i)=> (
              <Link key={i} to={c.to} state={c.state} className="group relative overflow-hidden rounded-2xl shadow-md border border-gray-200 bg-white">
                <img src={c.img} alt={c.title} className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 p-5 text-white">
                  <h3 className="text-xl font-semibold">{c.title}</h3>
                  <p className="text-sm opacity-90">Shop now →</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <LatestCollection/>
        <QuizBanner/>
        <BestSeller/>

        {/* Promo strip */}
        <section className="my-12 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {[{
              icon: assets.exchange_icon, title:'Free 14-day Returns', desc:'Try at home with hassle-free returns.'
            },{ icon: assets.quality_icon, title:'Premium Quality', desc:'Durable frames and lenses you can trust.'
            },{ icon: assets.support_img, title:'24/7 Support', desc:'We’re here to help, any time.'
            }].map((f,i)=> (
              <div key={i} className="flex items-center gap-4 p-6 border-t md:border-t-0 md:border-l first:border-l-0">
                <img src={f.icon} alt="" className="w-12 h-12 object-contain" />
                <div>
                  <h4 className="font-semibold text-gray-900">{f.title}</h4>
                  <p className="text-sm text-gray-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <OurPolicy/>
        <LatestBlogs/>
        <div className="w-full -mx-4 sm:-mx-[5vw] md:-mx-[7vw] lg:-mx-[9vw] bg-[#233362]/5 py-16">
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] max-w-screen-2xl mx-auto flex justify-center">
            <NewsletterBox />
          </div>
        </div>

       
      </div>
    </div>
  )
}

export default Home