import React from "react";

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import { FreeMode } from "swiper";
import 'swiper/swiper.min.css'
import 'swiper/modules/pagination/pagination.min.css'
import '../cssfiles/chartslider.css'
import Linechart from "./LineChart";
import Barchat from "./Barchart";
import Areachart from "./Areachart";
import Piechart from "./Piechart";
const ChartSlider=()=>{
    return(
        <div className="container-slider">
            <Swiper 
            freeMode={true}
            grabCursor={true}
            modules={[FreeMode]}
            className="mySwiper"
            slidesPerView={1}
            spaceBetween={30}>
                <SwiperSlide>
                    <Linechart/>
                </SwiperSlide>
                <SwiperSlide>
                    <Barchat/>
                </SwiperSlide>
                <SwiperSlide>
                    <Areachart/>
                </SwiperSlide>
                <SwiperSlide>
                    <Piechart/>
                </SwiperSlide>

            </Swiper>

        </div>
    );
};

export default ChartSlider;