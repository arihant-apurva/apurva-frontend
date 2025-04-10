import React from 'react'
import contentImage from './images/Content-image.webp'
import categoryImage from './images/Category-image.webp'
import newsImage from './images/News-image.webp'
import regionalImage from './images/Regional-image.webp'
import sensorshipImage from './images/Sensorship-image.webp'
import queueImage from './images/Queue-image.webp'
import indexImage from './images/Index-image.webp'
import newsImageHindi from './images/News-hindi-image.webp'
import newsImageMarathi from './images/News-marathi-image.webp'
import newsImageGujarati from './images/News-gujarati-image.webp'
import newsImageMalayalam from './images/News-malyalam-image.webp'
import newsImageTelugu from './images/News-telugu-image.webp'
import newsImageTamil from './images/News-tamil-image.webp'
import newsImageBengali from './images/News-bengali-image.webp'
import newsImageKannada from './images/News-kannada-image.webp'
import newsImageOdia from './images/News-odia-image.webp'
import MediaCard from '../common/MediaCard'

export default function ApurvaHorizon() {
  return (
    <div className='d-flex flex-wrap gap-4 justify-content-around'>
        <MediaCard url={contentImage} redirectTo={'/admin/content-type'} title={'Content Type'}/>
        <MediaCard url={categoryImage} redirectTo={'/admin/category-type/list'} title={'Category Type'}/>
        <MediaCard url={newsImage} redirectTo={'/admin/news/list'} title={'News'}/>
        <MediaCard url={regionalImage} redirectTo={'/admin/regional-news/list'} title={'Regional News'}/>
        <MediaCard url={sensorshipImage} redirectTo={'/admin/sensorship-news/panel'} title={'Sensorship News'}/>
        <MediaCard url={queueImage} redirectTo={'/admin/ready-queue/list'} title={'Ready Queue'}/>
        <MediaCard url={indexImage} redirectTo={'/admin/indexing/panel'} title={'Indexing'}/>
        <MediaCard url={newsImageHindi} redirectTo={'/admin/news/news_hi/list'} title={'News (Hindi)'}/>
        <MediaCard url={newsImageMarathi} redirectTo={'/admin/news/news_mr/list'} title={'News (Marathi)'}/>
        <MediaCard url={newsImageGujarati} redirectTo={'/admin/news/news_gu/list'} title={'News (Gujarati)'}/>
        <MediaCard url={newsImageMalayalam} redirectTo={'/admin/news/news_ml/list'} title={'News (Malyalam)'}/>
        <MediaCard url={newsImageTelugu} redirectTo={'/admin/news/news_te/list'} title={'News (Telugu)'}/>
        <MediaCard url={newsImageTamil} redirectTo={'/admin/news/news_ta/list'} title={'News (Tamil)'}/>
        <MediaCard url={newsImageBengali} redirectTo={'/admin/news/news_bn/list'} title={'News (Bengali)'}/>
        <MediaCard url={newsImageKannada} redirectTo={'/admin/news/news_kn/list'} title={'News (Kannada)'}/>
        <MediaCard url={newsImageOdia} redirectTo={'/admin/news/news_or/list'} title={'News (Odia)'}/>
    </div>
)
}
