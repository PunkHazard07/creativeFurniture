import React from 'react'
import CategorySection from '../components/CategorySection'
import Hero from '../components/Hero'
import LatestCollection from '../components/LatestCollection'
import OurPolicy from '../components/OurPolicy'
import NewsletterBox from '../components/NewsletterBox'
const Home = () => {
return (
    <div>
        <Hero/>
        <LatestCollection/>
        <CategorySection/>
        <OurPolicy/>
        <NewsletterBox/>
    </div>
)
}

export default Home